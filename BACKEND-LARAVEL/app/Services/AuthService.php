<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Professional;
use App\Models\Realtor;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Register a new customer
     */
    public function registerCustomer(array $data): array
    {
        $customer = Customer::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
            'zip_code' => $data['zip_code'],
        ]);

        $token = JWTAuth::fromUser($customer);

        return [
            'customer' => $customer,
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * Register a new professional
     */
    public function registerProfessional(array $data): array
    {
        $professional = Professional::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
            'company_name' => $data['company_name'],
            'company_street_address' => $data['company_street_address'] ?? null,
            'company_city' => $data['company_city'],
            'state' => $data['state'],
            'zip_code' => $data['zip_code'],
            'company_number' => $data['company_number'],
            'years' => $data['years'],
        ]);

        $token = JWTAuth::fromUser($professional);

        return [
            'professional' => $professional,
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * Register a new realtor
     */
    public function registerRealtor(array $data): array
    {
        $realtor = Realtor::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
            'real_state_agency_name' => $data['real_state_agency_name'],
            'city_of_real_state_agency' => $data['city_of_real_state_agency'] ?? null,
            'state' => $data['state'] ?? null,
            'zip_code' => $data['zip_code'] ?? null,
        ]);

        $token = JWTAuth::fromUser($realtor);

        return [
            'realtor' => $realtor,
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * Authenticate user and return token
     */
    public function login(array $credentials, string $userType = 'customer'): ?array
    {
        // Set the guard based on user type
        $guard = $userType;

        if (!$token = Auth::guard($guard)->attempt($credentials)) {
            return null;
        }

        $user = Auth::guard($guard)->user();

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * Logout user and invalidate token
     */
    public function logout(): bool
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Change user password
     */
    public function changePassword($user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        return true;
    }

    /**
     * Update user profile
     */
    public function updateProfile($user, array $data): bool
    {
        try {
            $user->update($data);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get authenticated user
     */
    public function getAuthenticatedUser(string $guard = 'customer')
    {
        return Auth::guard($guard)->user();
    }
}