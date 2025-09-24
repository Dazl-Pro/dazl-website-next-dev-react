<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProjectOpportunityResource;
use App\Services\ProjectOpportunityService;
use App\Models\ProjectOpportunity;

class ProjectOpportunityController extends Controller
{
    protected ProjectOpportunityService $opportunityService;

    public function __construct(ProjectOpportunityService $opportunityService)
    {
        $this->opportunityService = $opportunityService;
    }

    /**
     * Get project opportunities for professionals with pagination
     * Route: GET /project-opportunities/professionals/{page}
     */
    public function getProjectOpportunitiesForPros($page = 1)
    {
        try {
            $professionalId = auth()->id();
            $filters = request()->only(['status', 'min_price', 'max_price', 'project_status', 'location']);

            $opportunities = $this->opportunityService->getOpportunitiesForProfessional(
                $professionalId,
                $filters,
                $page
            );

            return response()->json([
                'success' => true,
                'data' => ProjectOpportunityResource::collection($opportunities->items()),
                'pagination' => [
                    'current_page' => $opportunities->currentPage(),
                    'total_pages' => $opportunities->lastPage(),
                    'total_items' => $opportunities->total(),
                    'per_page' => $opportunities->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve project opportunities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create/Submit bid for project opportunity
     * Route: PATCH /project-opportunities/{id}
     */
    public function create(Request $request, $id)
    {
        // This method name matches the route but should actually submit a bid
        return $this->submitBid($request, $id);
    }

    /**
     * Get opportunities for authenticated professional
     */
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['status', 'min_price', 'max_price', 'project_status']);
            $opportunities = $this->opportunityService->getOpportunitiesForProfessional(
                auth()->id(),
                $filters
            );

            return response()->json([
                'success' => true,
                'data' => ProjectOpportunityResource::collection($opportunities->items()),
                'pagination' => [
                    'current_page' => $opportunities->currentPage(),
                    'total_pages' => $opportunities->lastPage(),
                    'total_items' => $opportunities->total(),
                    'per_page' => $opportunities->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve opportunities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit bid for project opportunity
     */
    public function submitBid(Request $request, $projectId)
    {
        $request->validate([
            'bid_amount' => 'required|numeric|min:0',
            'estimated_hours' => 'required|integer|min:1',
            'proposal_message' => 'required|string|max:1000',
            'service_type_ids' => 'required|array',
            'service_type_ids.*' => 'exists:service_types,id'
        ]);

        try {
            $opportunity = $this->opportunityService->submitBid(
                $projectId,
                auth()->id(),
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Bid submitted successfully',
                'data' => new ProjectOpportunityResource($opportunity)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit bid',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific opportunity
     */
    public function show($id)
    {
        try {
            $professionalId = auth()->id();
            $opportunity = ProjectOpportunity::with(['project', 'project.customer', 'serviceTypes'])
                                           ->where('id', $id)
                                           ->where('professional_id', $professionalId)
                                           ->first();

            if (!$opportunity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opportunity not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ProjectOpportunityResource($opportunity)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve opportunity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update bid
     */
    public function updateBid(Request $request, $id)
    {
        $request->validate([
            'bid_amount' => 'sometimes|numeric|min:0',
            'estimated_hours' => 'sometimes|integer|min:1',
            'proposal_message' => 'sometimes|string|max:1000'
        ]);

        try {
            $professionalId = auth()->id();
            $opportunity = ProjectOpportunity::where('id', $id)
                                           ->where('professional_id', $professionalId)
                                           ->where('status', 'pending')
                                           ->first();

            if (!$opportunity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opportunity not found or cannot be updated'
                ], 404);
            }

            $opportunity->update($request->only(['bid_amount', 'estimated_hours', 'proposal_message']));

            return response()->json([
                'success' => true,
                'message' => 'Bid updated successfully',
                'data' => new ProjectOpportunityResource($opportunity->fresh())
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bid',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Withdraw bid
     */
    public function withdrawBid($id)
    {
        try {
            $professionalId = auth()->id();
            $opportunity = ProjectOpportunity::where('id', $id)
                                           ->where('professional_id', $professionalId)
                                           ->where('status', 'pending')
                                           ->first();

            if (!$opportunity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opportunity not found or cannot be withdrawn'
                ], 404);
            }

            $opportunity->update(['status' => 'withdrawn']);

            return response()->json([
                'success' => true,
                'message' => 'Bid withdrawn successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to withdraw bid',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
