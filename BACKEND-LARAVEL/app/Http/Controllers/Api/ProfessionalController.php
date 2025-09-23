<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfessionalRegistrationRequest;
use App\Http\Resources\ProfessionalResource;
use App\Services\AuthService;

class ProfessionalController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register Professional
     */
    public function register(ProfessionalRegistrationRequest $request)
    {
        try {
            $result = $this->authService->registerProfessional($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Professional registered successfully',
                'data' => [
                    'professional' => new ProfessionalResource($result['professional']),
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
     * Login Professional
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $credentials = $request->only('email', 'password');
            $result = $this->authService->login($credentials, 'professional');

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
                    'professional' => new ProfessionalResource($result['user']),
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
     * Logout Professional
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
     * Update Professional Profile
     */
    public function update(Request $request)
    {
        $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|nullable|string|max:20',
            'company_name' => 'sometimes|string|max:255',
            'company_street_address' => 'sometimes|nullable|string|max:255',
            'company_city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'zip_code' => 'sometimes|string|max:10',
            'company_number' => 'sometimes|string|max:255',
            'years' => 'sometimes|string|max:10',
            'business_licence' => 'sometimes|nullable|string',
            'insurance_licence' => 'sometimes|nullable|string',
            'project_portfolio' => 'sometimes|nullable|string',
            'website' => 'sometimes|nullable|string|max:255',
        ]);

        try {
            $professional = auth()->user();
            $updateData = $request->only([
                'first_name', 'last_name', 'phone_number',
                'company_name', 'company_street_address', 'company_city',
                'state', 'zip_code', 'company_number', 'years',
                'business_licence', 'insurance_licence', 'project_portfolio', 'website'
            ]);

            if ($this->authService->updateProfile($professional, $updateData)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Profile updated successfully',
                    'data' => new ProfessionalResource($professional->fresh())
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Update failed'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change Professional Password
     */
    public function change_password(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        try {
            $professional = auth()->user();

            if ($this->authService->changePassword(
                $professional,
                $request->current_password,
                $request->new_password
            )) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password changed successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password change failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Professional by ID
     */
    public function getProfessionalById(Request $request)
    {
        try {
            $professional_id = $request->get('professional_id');

            if ($professional_id) {
                $professional = Professional::find($professional_id);
            } else {
                $professional = auth()->user();
            }

            if (!$professional) {
                return response()->json([
                    'success' => false,
                    'message' => 'Professional not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $professional
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve professional',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
