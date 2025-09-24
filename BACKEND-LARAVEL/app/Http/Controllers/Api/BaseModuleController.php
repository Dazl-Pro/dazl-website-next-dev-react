<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseModuleController extends Controller
{
    /**
     * Get all base modules
     */
    public function index()
    {
        try {
            // Return base modules for system configuration
            $modules = [
                ['id' => 1, 'name' => 'Authentication', 'slug' => 'auth', 'active' => true],
                ['id' => 2, 'name' => 'Projects', 'slug' => 'projects', 'active' => true],
                ['id' => 3, 'name' => 'PHD Reports', 'slug' => 'phd_reports', 'active' => true],
                ['id' => 4, 'name' => 'Payments', 'slug' => 'payments', 'active' => true],
                ['id' => 5, 'name' => 'Notifications', 'slug' => 'notifications', 'active' => true],
                ['id' => 6, 'name' => 'File Management', 'slug' => 'files', 'active' => true],
                ['id' => 7, 'name' => 'User Management', 'slug' => 'users', 'active' => true],
            ];

            return response()->json([
                'success' => true,
                'data' => $modules
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve base modules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
