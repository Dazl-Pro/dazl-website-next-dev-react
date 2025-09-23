<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Project;

class RoomController extends Controller
{
    /**
     * Get all rooms
     */
    public function index(Request $request)
    {
        try {
            $query = Room::with(['features', 'roomIssues']);

            // Filter by house type
            if ($request->has('house_type')) {
                $query->where('house_type', $request->house_type);
            }

            // Filter by active status
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            $rooms = $query->orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data' => $rooms
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get room by ID
     */
    public function show($id)
    {
        try {
            $room = Room::with(['features', 'features.featureIssues', 'roomIssues'])->find($id);

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $room
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get rooms by house type
     */
    public function getByHouseType($houseType)
    {
        try {
            $validHouseTypes = ['single_family', 'apartment', 'condo', 'townhouse', 'mobile_home', 'other'];

            if (!in_array($houseType, $validHouseTypes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid house type'
                ], 400);
            }

            $rooms = Room::with(['features'])
                        ->where('house_type', $houseType)
                        ->where('is_active', true)
                        ->orderBy('name')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $rooms
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms for house type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get rooms for project
     */
    public function getForProject($projectId)
    {
        try {
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            // Get rooms associated with this project through pivot table
            $projectRooms = $project->rooms()->with(['features', 'roomIssues'])->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'project_id' => $projectId,
                    'rooms' => $projectRooms
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms for project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new room
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'house_type' => 'required|string|in:single_family,apartment,condo,townhouse,mobile_home,other',
            'typical_size_sqft' => 'nullable|numeric|min:0',
            'inspection_priority' => 'required|integer|between:1,5',
            'is_active' => 'boolean'
        ]);

        try {
            $room = Room::create([
                'name' => $request->name,
                'description' => $request->description,
                'house_type' => $request->house_type,
                'typical_size_sqft' => $request->typical_size_sqft,
                'inspection_priority' => $request->inspection_priority,
                'is_active' => $request->boolean('is_active', true)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => $room
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update room
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'house_type' => 'sometimes|string|in:single_family,apartment,condo,townhouse,mobile_home,other',
            'typical_size_sqft' => 'sometimes|nullable|numeric|min:0',
            'inspection_priority' => 'sometimes|integer|between:1,5',
            'is_active' => 'sometimes|boolean'
        ]);

        try {
            $room = Room::find($id);

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found'
                ], 404);
            }

            $room->update($request->only([
                'name', 'description', 'house_type', 'typical_size_sqft',
                'inspection_priority', 'is_active'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully',
                'data' => $room->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete room
     */
    public function destroy($id)
    {
        try {
            $room = Room::find($id);

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found'
                ], 404);
            }

            // Check if room has associated features or issues
            if ($room->features()->count() > 0 || $room->roomIssues()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete room with existing features or issues. Please resolve them first.'
                ], 400);
            }

            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add room to project
     */
    public function addToProject(Request $request, $projectId)
    {
        $request->validate([
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id'
        ]);

        try {
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            // Attach rooms to project (many-to-many relationship)
            $project->rooms()->syncWithoutDetaching($request->room_ids);

            return response()->json([
                'success' => true,
                'message' => 'Rooms added to project successfully',
                'data' => [
                    'project_id' => $projectId,
                    'added_rooms' => $request->room_ids
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add rooms to project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove room from project
     */
    public function removeFromProject($projectId, $roomId)
    {
        try {
            $project = Project::find($projectId);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            // Detach room from project
            $project->rooms()->detach($roomId);

            return response()->json([
                'success' => true,
                'message' => 'Room removed from project successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove room from project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get room statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_rooms' => Room::count(),
                'active_rooms' => Room::where('is_active', true)->count(),
                'rooms_by_house_type' => Room::selectRaw('house_type, COUNT(*) as count')
                                           ->groupBy('house_type')
                                           ->pluck('count', 'house_type')
                                           ->toArray(),
                'rooms_by_priority' => Room::selectRaw('inspection_priority, COUNT(*) as count')
                                          ->groupBy('inspection_priority')
                                          ->orderBy('inspection_priority')
                                          ->pluck('count', 'inspection_priority')
                                          ->toArray(),
                'average_size' => Room::whereNotNull('typical_size_sqft')->avg('typical_size_sqft'),
                'rooms_with_features' => Room::has('features')->count(),
                'rooms_with_issues' => Room::has('roomIssues')->count()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve room statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
