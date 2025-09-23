<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?Model;

    /**
     * Get active users
     */
    public function getActiveUsers(): Collection;

    /**
     * Get users by role
     */
    public function getUsersByRole(string $role): Collection;

    /**
     * Get recently registered users
     */
    public function getRecentUsers(int $limit = 10): Collection;

    /**
     * Search users
     */
    public function searchUsers(string $term): Collection;

    /**
     * Get user statistics
     */
    public function getUserStatistics(): array;

    /**
     * Update user password
     */
    public function updatePassword(int $userId, string $hashedPassword): bool;

    /**
     * Verify user email
     */
    public function verifyEmail(int $userId): bool;

    /**
     * Block/unblock user
     */
    public function updateUserStatus(int $userId, bool $isActive): bool;
}