<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\RealtorRegistrationRequest;
use App\Http\Resources\RealtorResource;
use App\Services\AuthService;

class RealtorController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register Realtor
     */
    public function register(RealtorRegistrationRequest $request)
    {
        try {
            $result = $this->authService->registerRealtor($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Realtor registered successfully',
                'data' => [
                    'realtor' => new RealtorResource($result['realtor']),
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login Realtor
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $credentials = $request->only('email', 'password');
            $result = $this->authService->login($credentials, 'realtor');

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'realtor' => new RealtorResource($result['user']),
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout Realtor
     */
    public function logout()
    {
        if ($this->authService->logout()) {
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Logout failed'
        ], 500);
    }

    /**
     * Update Realtor Profile
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|nullable|string|max:20',
            'real_state_agency_name' => 'sometimes|string|max:255',
            'city_of_real_state_agency' => 'sometimes|nullable|string|max:255',
            'state' => 'sometimes|nullable|string|max:255',
            'zip_code' => 'sometimes|nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $realtor = auth()->user();
            $realtor->update($request->only([
                'first_name', 'last_name', 'phone_number',
                'real_state_agency_name', 'city_of_real_state_agency',
                'state', 'zip_code'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $realtor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change Realtor Password
     */
    public function change_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $realtor = auth()->user();

            if (!Hash::check($request->current_password, $realtor->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $realtor->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password change failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Realtor by ID
     */
    public function getRealtorById(Request $request)
    {
        try {
            $realtor_id = $request->get('realtor_id');

            if ($realtor_id) {
                $realtor = Realtor::find($realtor_id);
            } else {
                $realtor = auth()->user();
            }

            if (!$realtor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Realtor not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $realtor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve realtor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Filter Projects (TODO: Implement with Project model)
     */
    public function filterProject(Request $request)
    {
        // TODO: Implement when Project model is ready
        return response()->json([
            'success' => true,
            'message' => 'Projects filtered',
            'data' => []
        ]);
    }

    /**
     * Update Project Status (TODO: Implement with Project model)
     */
    public function update_project_status($id)
    {
        // TODO: Implement when Project model is ready
        return response()->json([
            'success' => true,
            'message' => 'Project status updated'
        ]);
    }
}
