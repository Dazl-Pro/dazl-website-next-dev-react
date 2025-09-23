<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Realtor;
use Tymon\JWTAuth\Facades\JWTAuth;

class RealtorController extends Controller
{
    /**
     * Register Realtor
     *
     * @bodyParam email string required Example: polagorge@gmail.com
     * @bodyParam password string required Example: 123123
     * @bodyParam confirm_password string required Example: 123123
     * @bodyParam first_name string required Example: Paula
     * @bodyParam last_name string required Example: George
     * @bodyParam phone_number string optional Example: +201272575873
     * @bodyParam real_state_agency_name string required Example: Garden Realty
     * @bodyParam city_of_real_state_agency string optional Example: New York
     * @bodyParam state string optional Example: NY
     * @bodyParam zip_code string optional Example: 10001
     * @bodyParam check_box boolean required Must accept terms and conditions
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:realtors,email',
            'password' => 'required|min:6|same:confirm_password',
            'confirm_password' => 'required',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'real_state_agency_name' => 'required|string|max:255',
            'city_of_real_state_agency' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'check_box' => 'required|accepted',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $realtor = Realtor::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
                'real_state_agency_name' => $request->real_state_agency_name,
                'city_of_real_state_agency' => $request->city_of_real_state_agency,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
            ]);

            $token = JWTAuth::fromUser($realtor);

            return response()->json([
                'success' => true,
                'message' => 'Realtor registered successfully',
                'data' => [
                    'realtor' => $realtor,
                    'token' => $token,
                    'token_type' => 'bearer',
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
     *
     * @bodyParam email string required Example: polagorge@gmail.com
     * @bodyParam password string required Example: 123123
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $realtor = auth()->user();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'realtor' => $realtor,
                'token' => $token,
                'token_type' => 'bearer',
            ]
        ]);
    }

    /**
     * Logout Realtor
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
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
