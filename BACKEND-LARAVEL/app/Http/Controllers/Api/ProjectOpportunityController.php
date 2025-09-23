<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ProjectOpportunityResource;
use App\Models\ProjectOpportunity;
use App\Models\Project;

class ProjectOpportunityController extends Controller
{
    /**
     * Get opportunities for authenticated professional
     */
    public function index(Request $request)
    {
        try {
            $professionalId = auth()->id();
            $query = ProjectOpportunity::with(['project', 'project.customer'])
                                     ->where('professional_id', $professionalId);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by price range
            if ($request->has('min_price')) {
                $query->where('bid_amount', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('bid_amount', '<=', $request->max_price);
            }

            $opportunities = $query->orderBy('created_at', 'desc')->paginate(20);

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
            $professionalId = auth()->id();
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            if ($project->status !== 'published') {
                return response()->json([
                    'success' => false,
                    'message' => 'Project is not accepting bids'
                ], 400);
            }

            // Check if professional already submitted a bid
            $existingBid = ProjectOpportunity::where('project_id', $projectId)
                                           ->where('professional_id', $professionalId)
                                           ->first();

            if ($existingBid) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already submitted a bid for this project'
                ], 400);
            }

            $opportunity = ProjectOpportunity::create([
                'project_id' => $projectId,
                'professional_id' => $professionalId,
                'bid_amount' => $request->bid_amount,
                'estimated_hours' => $request->estimated_hours,
                'proposal_message' => $request->proposal_message,
                'status' => 'pending',
                'submitted_at' => now()
            ]);

            // Attach service types
            $opportunity->serviceTypes()->attach($request->service_type_ids);

            return response()->json([
                'success' => true,
                'message' => 'Bid submitted successfully',
                'data' => new ProjectOpportunityResource($opportunity->load(['project', 'serviceTypes']))
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
