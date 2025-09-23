<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feature;
use App\Models\Room;

class FeatureController extends Controller
{
    /**
     * Get all features
     */
    public function index(Request $request)
    {
        try {
            $query = Feature::with(['room', 'featureIssues']);

            // Filter by room
            if ($request->has('room_id')) {
                $query->where('room_id', $request->room_id);
            }

            // Filter by active status
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            $features = $query->orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data' => $features
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve features',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get feature by ID
     */
    public function show($id)
    {
        try {
            $feature = Feature::with(['room', 'featureIssues', 'featureOptions'])->find($id);

            if (!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feature not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $feature
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve feature',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get features by room
     */
    public function getByRoom($roomId)
    {
        try {
            $room = Room::find($roomId);

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found'
                ], 404);
            }

            $features = Feature::with(['featureIssues', 'featureOptions'])
                              ->where('room_id', $roomId)
                              ->where('is_active', true)
                              ->orderBy('name')
                              ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'room' => $room,
                    'features' => $features
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve features for room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new feature
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'room_id' => 'required|exists:rooms,id',
            'feature_type' => 'required|string|in:structural,electrical,plumbing,hvac,cosmetic,other',
            'inspection_priority' => 'required|integer|between:1,5',
            'estimated_cost_min' => 'nullable|numeric|min:0',
            'estimated_cost_max' => 'nullable|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            $feature = Feature::create([
                'name' => $request->name,
                'description' => $request->description,
                'room_id' => $request->room_id,
                'feature_type' => $request->feature_type,
                'inspection_priority' => $request->inspection_priority,
                'estimated_cost_min' => $request->estimated_cost_min,
                'estimated_cost_max' => $request->estimated_cost_max,
                'is_active' => $request->boolean('is_active', true)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feature created successfully',
                'data' => $feature->load(['room'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create feature',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update feature
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'room_id' => 'sometimes|exists:rooms,id',
            'feature_type' => 'sometimes|string|in:structural,electrical,plumbing,hvac,cosmetic,other',
            'inspection_priority' => 'sometimes|integer|between:1,5',
            'estimated_cost_min' => 'sometimes|nullable|numeric|min:0',
            'estimated_cost_max' => 'sometimes|nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean'
        ]);

        try {
            $feature = Feature::find($id);

            if (!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feature not found'
                ], 404);
            }

            $feature->update($request->only([
                'name', 'description', 'room_id', 'feature_type',
                'inspection_priority', 'estimated_cost_min', 'estimated_cost_max', 'is_active'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Feature updated successfully',
                'data' => $feature->fresh(['room'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update feature',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete feature
     */
    public function destroy($id)
    {
        try {
            $feature = Feature::find($id);

            if (!$feature) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feature not found'
                ], 404);
            }

            // Check if feature has associated issues
            if ($feature->featureIssues()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete feature with existing issues. Please resolve issues first.'
                ], 400);
            }

            $feature->delete();

            return response()->json([
                'success' => true,
                'message' => 'Feature deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete feature',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get feature statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_features' => Feature::count(),
                'active_features' => Feature::where('is_active', true)->count(),
                'features_by_type' => Feature::selectRaw('feature_type, COUNT(*) as count')
                                           ->groupBy('feature_type')
                                           ->pluck('count', 'feature_type')
                                           ->toArray(),
                'features_by_priority' => Feature::selectRaw('inspection_priority, COUNT(*) as count')
                                                ->groupBy('inspection_priority')
                                                ->orderBy('inspection_priority')
                                                ->pluck('count', 'inspection_priority')
                                                ->toArray(),
                'average_cost_range' => [
                    'min' => Feature::whereNotNull('estimated_cost_min')->avg('estimated_cost_min'),
                    'max' => Feature::whereNotNull('estimated_cost_max')->avg('estimated_cost_max')
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve feature statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
