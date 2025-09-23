<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
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

        // Map class names to role names
        $roleMap = [
            'Customer' => 'customer',
            'Professional' => 'professional',
            'Realtor' => 'realtor',
            'Admin' => 'admin',
        ];

        $userRole = $roleMap[$userType] ?? null;

        // Check if user has the required role
        if ($userRole !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions',
                'required_role' => $role,
                'user_role' => $userRole
            ], 403);
        }

        return $next($request);
    }
}