<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Customer;
use Tymon\JWTAuth\Facades\JWTAuth;

class CustomerController extends Controller
{
    /**
     * Register Customer
     *
     * @bodyParam email string required Example: customer@example.com
     * @bodyParam password string required Example: 123123
     * @bodyParam confirm_password string required Example: 123123
     * @bodyParam first_name string required Example: Jane
     * @bodyParam last_name string required Example: Doe
     * @bodyParam phone_number string optional Example: +1234567890
     * @bodyParam zip_code string required Example: 10001
     * @bodyParam check_box boolean required Must accept terms and conditions
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:customers,email',
            'password' => 'required|min:6|same:confirm_password',
            'confirm_password' => 'required',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'zip_code' => 'required|string|max:10',
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
            $customer = Customer::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone_number,
                'zip_code' => $request->zip_code,
            ]);

            $token = JWTAuth::fromUser($customer);

            return response()->json([
                'success' => true,
                'message' => 'Customer registered successfully',
                'data' => [
                    'customer' => $customer,
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
     * Login Customer
     *
     * @bodyParam email string required Example: customer@example.com
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

        $customer = auth()->user();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'customer' => $customer,
                'token' => $token,
                'token_type' => 'bearer',
            ]
        ]);
    }

    /**
     * Logout Customer
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
     * Update Customer Profile
     */
    public function update(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|nullable|string|max:20',
            'zip_code' => 'sometimes|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            if ($id) {
                $customer = Customer::find($id);
                if (!$customer) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Customer not found'
                    ], 404);
                }
            } else {
                $customer = auth()->user();
            }

            $customer->update($request->only([
                'first_name', 'last_name', 'phone_number', 'zip_code'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $customer
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
     * Change Customer Password
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
            $customer = auth()->user();

            if (!Hash::check($request->current_password, $customer->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $customer->update([
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
     * Get Customer by ID
     */
    public function getCustomerById(Request $request)
    {
        try {
            $customer_id = $request->get('customer_id');

            if ($customer_id) {
                $customer = Customer::find($customer_id);
            } else {
                $customer = auth()->user();
            }

            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $customer
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
