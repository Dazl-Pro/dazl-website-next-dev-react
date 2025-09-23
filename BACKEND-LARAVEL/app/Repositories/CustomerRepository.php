<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * Get the model instance
     */
    protected function getModel(): Model
    {
        return new Customer();
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?Model
    {
        return $this->findOneBy(['email' => $email]);
    }

    /**
     * Get active users
     */
    public function getActiveUsers(): Collection
    {
        return $this->active()->get();
    }

    /**
     * Get users by role
     */
    public function getUsersByRole(string $role): Collection
    {
        // Customers don't have roles, return all active customers
        return $this->getActiveUsers();
    }

    /**
     * Get recently registered users
     */
    public function getRecentUsers(int $limit = 10): Collection
    {
        return $this->latest()->limit($limit)->get();
    }

    /**
     * Search users
     */
    public function searchUsers(string $term): Collection
    {
        return $this->search($term, ['first_name', 'last_name', 'email'])
                    ->get();
    }

    /**
     * Get user statistics
     */
    public function getUserStatistics(): array
    {
        $totalCustomers = $this->countBy();
        $activeCustomers = $this->countBy(['is_active' => true]);
        $verifiedCustomers = $this->countBy(['email_verified_at' => ['!=', null]]);

        // Customers by registration month
        $monthlyRegistrations = Customer::selectRaw('
            YEAR(created_at) as year,
            MONTH(created_at) as month,
            COUNT(*) as count
        ')
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->limit(12)
        ->get()
        ->toArray();

        // Customers by state/location
        $customersByLocation = Customer::selectRaw('state, COUNT(*) as count')
                                     ->whereNotNull('state')
                                     ->groupBy('state')
                                     ->orderBy('count', 'desc')
                                     ->limit(10)
                                     ->pluck('count', 'state')
                                     ->toArray();

        return [
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
            'verified_customers' => $verifiedCustomers,
            'verification_rate' => $totalCustomers > 0 ? round(($verifiedCustomers / $totalCustomers) * 100, 2) : 0,
            'monthly_registrations' => $monthlyRegistrations,
            'customers_by_location' => $customersByLocation,
        ];
    }

    /**
     * Update user password
     */
    public function updatePassword(int $userId, string $hashedPassword): bool
    {
        $customer = $this->find($userId);

        if ($customer) {
            return $customer->update(['password' => $hashedPassword]);
        }

        return false;
    }

    /**
     * Verify user email
     */
    public function verifyEmail(int $userId): bool
    {
        $customer = $this->find($userId);

        if ($customer) {
            return $customer->update(['email_verified_at' => now()]);
        }

        return false;
    }

    /**
     * Block/unblock user
     */
    public function updateUserStatus(int $userId, bool $isActive): bool
    {
        $customer = $this->find($userId);

        if ($customer) {
            return $customer->update(['is_active' => $isActive]);
        }

        return false;
    }

    /**
     * Get customers with projects
     */
    public function getCustomersWithProjects(): Collection
    {
        return $this->with(['projects'])
                    ->query
                    ->whereHas('projects')
                    ->get();
    }

    /**
     * Get top customers by project count
     */
    public function getTopCustomersByProjects(int $limit = 10): Collection
    {
        return $this->with(['projects'])
                    ->query
                    ->withCount('projects')
                    ->orderBy('projects_count', 'desc')
                    ->limit($limit)
                    ->get();
    }
}