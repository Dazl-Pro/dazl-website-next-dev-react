<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceTypeResource;
use App\Models\ServiceType;

class ServiceTypeController extends Controller
{
    /**
     * Get all service types
     */
    public function index()
    {
        try {
            $serviceTypes = ServiceType::active()->orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data' => ServiceTypeResource::collection($serviceTypes)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve service types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get service type by ID
     */
    public function show($id)
    {
        try {
            $serviceType = ServiceType::find($id);

            if (!$serviceType) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service type not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ServiceTypeResource($serviceType)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve service type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get service types by category
     */
    public function getByCategory($categoryId)
    {
        try {
            $serviceTypes = ServiceType::where('category_id', $categoryId)
                                     ->active()
                                     ->orderBy('name')
                                     ->get();

            return response()->json([
                'success' => true,
                'data' => ServiceTypeResource::collection($serviceTypes)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve service types for category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search service types
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        try {
            $query = ServiceType::active()->where('name', 'like', '%' . $request->query . '%');

            if ($request->category_id) {
                $query->where('category_id', $request->category_id);
            }

            $serviceTypes = $query->orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data' => ServiceTypeResource::collection($serviceTypes)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search service types',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
