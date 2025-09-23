<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Project;

class ProjectOwnershipMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $user = auth()->user();
        $userType = class_basename($user);

        // Get project ID from route parameters
        $projectId = $request->route('id') ?? $request->route('project');

        if (!$projectId) {
            return response()->json([
                'success' => false,
                'message' => 'Project ID not found in request'
            ], 400);
        }

        // Find the project
        $project = Project::find($projectId);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        // Check ownership based on user type
        $hasAccess = false;

        switch ($userType) {
            case 'Customer':
                $hasAccess = $project->customer_id === $user->id;
                break;

            case 'Professional':
                $hasAccess = $project->professional_id === $user->id ||
                           $project->projectOpportunities()
                                  ->where('professional_id', $user->id)
                                  ->exists();
                break;

            case 'Realtor':
                $hasAccess = $project->realtor_id === $user->id;
                break;

            case 'Admin':
                $hasAccess = true; // Admins can access all projects
                break;
        }

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to access this project'
            ], 403);
        }

        return $next($request);
    }
}