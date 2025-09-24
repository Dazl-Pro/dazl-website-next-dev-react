<?php

namespace App\Services;

use App\Models\ProjectOpportunity;
use App\Models\Project;
use App\Models\Professional;
use App\Events\BidSubmitted;
use App\Events\BidStatusUpdated;
use Illuminate\Support\Facades\DB;

class ProjectOpportunityService
{
    /**
     * Get project opportunities for a professional
     */
    public function getOpportunitiesForProfessional(int $professionalId, array $filters = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $query = ProjectOpportunity::with(['project', 'project.customer', 'serviceTypes'])
                                 ->where('professional_id', $professionalId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['min_price'])) {
            $query->where('bid_amount', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('bid_amount', '<=', $filters['max_price']);
        }

        if (isset($filters['project_status'])) {
            $query->whereHas('project', function($q) use ($filters) {
                $q->where('status', $filters['project_status']);
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Submit bid for a project
     */
    public function submitBid(int $projectId, int $professionalId, array $bidData): ProjectOpportunity
    {
        return DB::transaction(function () use ($projectId, $professionalId, $bidData) {
            $project = Project::findOrFail($projectId);

            // Validate project is accepting bids
            if ($project->status !== 'published') {
                throw new \Exception('Project is not accepting bids');
            }

            // Check if professional already submitted a bid
            $existingBid = ProjectOpportunity::where('project_id', $projectId)
                                           ->where('professional_id', $professionalId)
                                           ->first();

            if ($existingBid) {
                throw new \Exception('You have already submitted a bid for this project');
            }

            // Validate professional has required service types
            $professional = Professional::findOrFail($professionalId);
            $requiredServiceTypes = $bidData['service_type_ids'] ?? [];

            $professionalServiceTypes = $professional->serviceTypes()->pluck('service_types.id')->toArray();
            $missingServiceTypes = array_diff($requiredServiceTypes, $professionalServiceTypes);

            if (!empty($missingServiceTypes)) {
                throw new \Exception('Professional does not have all required service types');
            }

            // Create the opportunity
            $opportunity = ProjectOpportunity::create([
                'project_id' => $projectId,
                'professional_id' => $professionalId,
                'bid_amount' => $bidData['bid_amount'],
                'estimated_hours' => $bidData['estimated_hours'],
                'proposal_message' => $bidData['proposal_message'],
                'status' => 'pending',
                'submitted_at' => now()
            ]);

            // Attach service types
            if (!empty($requiredServiceTypes)) {
                $opportunity->serviceTypes()->attach($requiredServiceTypes);
            }

            // Fire event for real-time notifications
            BidSubmitted::dispatch($opportunity);

            return $opportunity->load(['project', 'serviceTypes']);
        });
    }

    /**
     * Update bid
     */
    public function updateBid(int $opportunityId, int $professionalId, array $updateData): ProjectOpportunity
    {
        $opportunity = ProjectOpportunity::where('id', $opportunityId)
                                       ->where('professional_id', $professionalId)
                                       ->where('status', 'pending')
                                       ->firstOrFail();

        $opportunity->update($updateData);

        // Fire event for updates
        BidStatusUpdated::dispatch($opportunity);

        return $opportunity->fresh();
    }

    /**
     * Accept bid (called by customer/project owner)
     */
    public function acceptBid(int $opportunityId, int $customerId): ProjectOpportunity
    {
        return DB::transaction(function () use ($opportunityId, $customerId) {
            $opportunity = ProjectOpportunity::with(['project', 'professional'])
                                           ->findOrFail($opportunityId);

            // Verify customer owns the project
            if ($opportunity->project->customer_id !== $customerId) {
                throw new \Exception('Unauthorized to accept this bid');
            }

            // Update opportunity status
            $opportunity->update([
                'status' => 'accepted',
                'accepted_at' => now()
            ]);

            // Update project status and assign professional
            $opportunity->project->update([
                'status' => 'in_progress',
                'professional_id' => $opportunity->professional_id,
                'selected_bid_amount' => $opportunity->bid_amount
            ]);

            // Reject all other bids for this project
            ProjectOpportunity::where('project_id', $opportunity->project_id)
                             ->where('id', '!=', $opportunityId)
                             ->where('status', 'pending')
                             ->update(['status' => 'rejected']);

            // Fire events
            BidStatusUpdated::dispatch($opportunity);

            return $opportunity;
        });
    }

    /**
     * Reject bid
     */
    public function rejectBid(int $opportunityId, int $customerId): ProjectOpportunity
    {
        $opportunity = ProjectOpportunity::with(['project'])
                                       ->findOrFail($opportunityId);

        // Verify customer owns the project
        if ($opportunity->project->customer_id !== $customerId) {
            throw new \Exception('Unauthorized to reject this bid');
        }

        $opportunity->update([
            'status' => 'rejected',
            'rejected_at' => now()
        ]);

        // Fire event
        BidStatusUpdated::dispatch($opportunity);

        return $opportunity;
    }

    /**
     * Withdraw bid
     */
    public function withdrawBid(int $opportunityId, int $professionalId): ProjectOpportunity
    {
        $opportunity = ProjectOpportunity::where('id', $opportunityId)
                                       ->where('professional_id', $professionalId)
                                       ->where('status', 'pending')
                                       ->firstOrFail();

        $opportunity->update([
            'status' => 'withdrawn',
            'withdrawn_at' => now()
        ]);

        // Fire event
        BidStatusUpdated::dispatch($opportunity);

        return $opportunity;
    }

    /**
     * Get available projects for bidding (for professionals)
     */
    public function getAvailableProjectsForBidding(int $professionalId, array $filters = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $professional = Professional::with('serviceTypes')->findOrFail($professionalId);
        $professionalServiceTypeIds = $professional->serviceTypes->pluck('id')->toArray();

        $query = Project::with(['customer', 'rooms', 'serviceTypes'])
                       ->where('status', 'published')
                       ->whereDoesntHave('opportunities', function($q) use ($professionalId) {
                           $q->where('professional_id', $professionalId);
                       });

        // Filter by compatible service types
        if (!empty($professionalServiceTypeIds)) {
            $query->whereHas('serviceTypes', function($q) use ($professionalServiceTypeIds) {
                $q->whereIn('service_types.id', $professionalServiceTypeIds);
            });
        }

        // Apply additional filters
        if (isset($filters['budget_min'])) {
            $query->where('budget', '>=', $filters['budget_min']);
        }

        if (isset($filters['budget_max'])) {
            $query->where('budget', '<=', $filters['budget_max']);
        }

        if (isset($filters['location'])) {
            $query->where(function($q) use ($filters) {
                $q->where('city', 'like', '%' . $filters['location'] . '%')
                  ->orWhere('state', 'like', '%' . $filters['location'] . '%')
                  ->orWhere('zip_code', 'like', '%' . $filters['location'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Get bid statistics for professional
     */
    public function getBidStatistics(int $professionalId): array
    {
        $stats = ProjectOpportunity::where('professional_id', $professionalId)
                                  ->selectRaw('
                                      COUNT(*) as total_bids,
                                      COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_bids,
                                      COUNT(CASE WHEN status = "accepted" THEN 1 END) as accepted_bids,
                                      COUNT(CASE WHEN status = "rejected" THEN 1 END) as rejected_bids,
                                      COUNT(CASE WHEN status = "withdrawn" THEN 1 END) as withdrawn_bids,
                                      AVG(bid_amount) as average_bid_amount,
                                      MAX(bid_amount) as highest_bid,
                                      MIN(bid_amount) as lowest_bid
                                  ')
                                  ->first();

        return [
            'total_bids' => $stats->total_bids ?? 0,
            'pending_bids' => $stats->pending_bids ?? 0,
            'accepted_bids' => $stats->accepted_bids ?? 0,
            'rejected_bids' => $stats->rejected_bids ?? 0,
            'withdrawn_bids' => $stats->withdrawn_bids ?? 0,
            'success_rate' => $stats->total_bids > 0 ? round(($stats->accepted_bids / $stats->total_bids) * 100, 2) : 0,
            'average_bid_amount' => round($stats->average_bid_amount ?? 0, 2),
            'highest_bid' => $stats->highest_bid ?? 0,
            'lowest_bid' => $stats->lowest_bid ?? 0,
        ];
    }
}