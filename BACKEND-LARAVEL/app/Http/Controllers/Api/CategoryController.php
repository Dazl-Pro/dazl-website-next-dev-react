<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index()
    {
        try {
            $categories = Category::with('serviceTypes')
                                ->where('is_active', true)
                                ->orderBy('name')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get category by ID with service types
     */
    public function show($id)
    {
        try {
            $category = Category::with('serviceTypes')->find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $category
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories with counts
     */
    public function withCounts()
    {
        try {
            $categories = Category::withCount(['serviceTypes', 'projects'])
                                ->where('is_active', true)
                                ->orderBy('name')
                                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories with counts',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
