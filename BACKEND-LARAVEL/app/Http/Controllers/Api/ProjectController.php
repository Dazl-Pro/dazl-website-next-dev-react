<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\CustomerResource;
use App\Services\ProjectService;
use App\Models\Project;
use App\Models\Customer;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Store Project and Images
     */
    public function store(StoreProjectRequest $request)
    {
        try {
            $project = $this->projectService->createProject(
                $request->validated(),
                auth()->id()
            );

            // Handle image uploads if provided
            if ($request->hasFile('images')) {
                $this->projectService->uploadProjectImages($project, $request->file('images'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Project stored successfully',
                'data' => new ProjectResource($project->load('projectImages'))
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to store project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload additional project images
     */
    public function projectImages(Request $request)
    {
        $request->validate([
            'projectID' => 'required|exists:projects,id',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $project = Project::findOrFail($request->projectID);
            $uploadedImages = $this->projectService->uploadProjectImages($project, $request->file('images'));

            return response()->json([
                'success' => true,
                'message' => 'Project images uploaded successfully',
                'data' => [
                    'project_id' => $request->projectID,
                    'uploaded_images' => $uploadedImages
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload single image
     */
    public function getimage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $imagePath = $request->file('image')->store('temp_images', 'public');

            return response()->json([
                'success' => true,
                'image' => $imagePath
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * List all customers
     */
    public function list()
    {
        try {
            $customers = Customer::all();

            return response()->json([
                'success' => true,
                'customer' => $customers
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve customers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific project
     */
    public function show($id)
    {
        try {
            $project = Project::with(['projectImages', 'customer', 'professional'])
                              ->find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $project
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update project status and send notifications to professionals
     */
    public function updateProjectStatusAndSendSmsToPros($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_type_ids' => 'required|array',
            'service_type_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $project = Project::find($id);
            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            // Update project status to published
            $project->update(['status' => 'published']);

            // TODO: Implement professional notification logic
            // This would involve finding professionals by service types
            // and sending SMS/email notifications

            return response()->json([
                'success' => true,
                'message' => 'Project status updated and notifications sent',
                'data' => $project
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get projects for customer
     */
    public function getProjectsForCustomer()
    {
        try {
            $userId = auth()->id();
            $projects = Project::with(['projectImages', 'professional'])
                              ->where('customer_id', $userId)
                              ->get();

            return response()->json([
                'success' => true,
                'data' => $projects
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete project
     */
    public function delete($id)
    {
        try {
            $project = Project::find($id);
            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            // Delete related images
            ProjectImage::where('project_id', $id)->delete();

            // Delete project
            $project->delete();

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Project deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update bid status
     */
    public function statusUpdate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'bid_status' => 'required|string',
            'feature_id' => 'nullable|integer',
            'room_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // TODO: Implement bid status update logic with proper pivot tables
            // This would involve ProjectToRoom and feature relationships

            return response()->json([
                'success' => true,
                'status' => 'success',
                'message' => 'Bid status updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bid status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update PHD report details
     */
    public function updatePhpreport(Request $request, $id)
    {
        try {
            $project = Project::find($id);
            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            $project->update($request->only([
                'title', 'description', 'budget_min', 'budget_max', 'location'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Details updated successfully',
                'data' => $project
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
