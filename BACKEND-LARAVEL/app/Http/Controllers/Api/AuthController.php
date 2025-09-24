<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Services\AuthService;
use App\Models\Customer;
use App\Models\Professional;
use App\Models\Realtor;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\ProfessionalResource;
use App\Http\Resources\RealtorResource;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * General login endpoint - determines user type and authenticates
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'user_type' => 'required|string|in:customer,professional,realtor'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $credentials = $request->only('email', 'password');
            $userType = $request->user_type;

            $result = $this->authService->login($credentials, $userType);

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Get appropriate resource class
            $resourceClass = match($userType) {
                'customer' => CustomerResource::class,
                'professional' => ProfessionalResource::class,
                'realtor' => RealtorResource::class,
                default => CustomerResource::class
            };

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => new $resourceClass($result['user']),
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'user_type' => $userType
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
     * General registration endpoint - determines user type and registers
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email|unique:professionals,email|unique:realtors,email',
            'password' => 'required|string|min:6|confirmed',
            'user_type' => 'required|string|in:customer,professional,realtor',
            'phone_number' => 'nullable|string|max:20',
            // Customer specific
            'zip_code' => 'required_if:user_type,customer|string|max:10',
            // Professional specific
            'company_name' => 'required_if:user_type,professional|string|max:255',
            'company_city' => 'required_if:user_type,professional|string|max:255',
            'state' => 'required_if:user_type,professional,realtor|string|max:255',
            'company_number' => 'required_if:user_type,professional|string|max:255',
            'years' => 'required_if:user_type,professional|string|max:10',
            // Realtor specific
            'real_state_agency_name' => 'required_if:user_type,realtor|string|max:255',
            'city_of_real_state_agency' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userType = $request->user_type;
            $data = $request->all();

            $result = match($userType) {
                'customer' => $this->authService->registerCustomer($data),
                'professional' => $this->authService->registerProfessional($data),
                'realtor' => $this->authService->registerRealtor($data),
                default => throw new \Exception('Invalid user type')
            };

            $resourceClass = match($userType) {
                'customer' => CustomerResource::class,
                'professional' => ProfessionalResource::class,
                'realtor' => RealtorResource::class,
                default => CustomerResource::class
            };

            $userKey = match($userType) {
                'customer' => 'customer',
                'professional' => 'professional',
                'realtor' => 'realtor',
                default => 'user'
            };

            return response()->json([
                'success' => true,
                'message' => ucfirst($userType) . ' registered successfully',
                'data' => [
                    $userKey => new $resourceClass($result[$userKey]),
                    'token' => $result['token'],
                    'token_type' => $result['token_type'],
                    'user_type' => $userType
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
     * Verify user account with token
     */
    public function verifyAccount($access_token)
    {
        try {
            // This would typically verify an email verification token
            // For now, return a simple response
            return response()->json([
                'success' => true,
                'message' => 'Account verified successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Account verification failed',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Check if user exists by email and type
     */
    public function checkUserExistence($type, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $email = $request->email;
            $exists = false;

            switch ($type) {
                case 'customer':
                    $exists = Customer::where('email', $email)->exists();
                    break;
                case 'professional':
                    $exists = Professional::where('email', $email)->exists();
                    break;
                case 'realtor':
                    $exists = Realtor::where('email', $email)->exists();
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid user type'
                    ], 400);
            }

            return response()->json([
                'success' => true,
                'exists' => $exists,
                'user_type' => $type,
                'email' => $email
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User existence check failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
