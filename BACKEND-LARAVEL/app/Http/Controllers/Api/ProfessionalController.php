<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Professional;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfessionalController extends Controller
{
    /**
     * Register Professional
     *
     * @bodyParam email string required Example: professional@company.com
     * @bodyParam password string required Example: 123123
     * @bodyParam confirm_password string required Example: 123123
     * @bodyParam first_name string required Example: John
     * @bodyParam last_name string required Example: Smith
     * @bodyParam phone_number string optional Example: +1234567890
     * @bodyParam company_name string required Example: Smith Construction
     * @bodyParam company_street_address string optional Example: 123 Main St
     * @bodyParam company_city string required Example: New York
     * @bodyParam state string required Example: NY
     * @bodyParam zip_code string required Example: 10001
     * @bodyParam company_number string required Example: License123
     * @bodyParam years string required Example: 5
     * @bodyParam check_box boolean required Must accept terms and conditions
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:professionals,email',
            'password' => 'required|min:6|same:confirm_password',
            'confirm_password' => 'required',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'company_name' => 'required|string|max:255',
            'company_street_address' => 'nullable|string|max:255',
            'company_city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'company_number' => 'required|string|max:255',
            'years' => 'required|string|max:10',
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
            $professional = Professional::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
                'company_name' => $request->company_name,
                'company_street_address' => $request->company_street_address,
                'company_city' => $request->company_city,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
                'company_number' => $request->company_number,
                'years' => $request->years,
            ]);

            $token = JWTAuth::fromUser($professional);

            return response()->json([
                'success' => true,
                'message' => 'Professional registered successfully',
                'data' => [
                    'professional' => $professional,
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
     * Login Professional
     *
     * @bodyParam email string required Example: professional@company.com
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

        $professional = auth()->user();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'professional' => $professional,
                'token' => $token,
                'token_type' => 'bearer',
            ]
        ]);
    }

    /**
     * Logout Professional
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
     * Update Professional Profile
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $professional = auth()->user();
            $professional->update($request->only([
                'first_name', 'last_name', 'phone_number',
                'company_name', 'company_street_address', 'company_city',
                'state', 'zip_code', 'company_number', 'years',
                'business_licence', 'insurance_licence', 'project_portfolio', 'website'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $professional
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
     * Change Professional Password
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
            $professional = auth()->user();

            if (!Hash::check($request->current_password, $professional->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $professional->update([
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
