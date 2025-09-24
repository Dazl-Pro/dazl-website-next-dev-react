<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    /**
     * Get all blog categories
     */
    public function index()
    {
        try {
            // Return basic blog categories - can be expanded with database
            $categories = [
                ['id' => 1, 'name' => 'Home Improvement', 'slug' => 'home-improvement'],
                ['id' => 2, 'name' => 'Real Estate', 'slug' => 'real-estate'],
                ['id' => 3, 'name' => 'Property Maintenance', 'slug' => 'property-maintenance'],
                ['id' => 4, 'name' => 'Contractor Tips', 'slug' => 'contractor-tips'],
                ['id' => 5, 'name' => 'Industry News', 'slug' => 'industry-news'],
            ];

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve blog categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
