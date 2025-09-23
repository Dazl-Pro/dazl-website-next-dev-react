<?php

namespace App\Repositories\Interfaces;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get projects for customer
     */
    public function getProjectsForCustomer(int $customerId): Collection;

    /**
     * Get published projects
     */
    public function getPublishedProjects(): Collection;

    /**
     * Get projects by status
     */
    public function getProjectsByStatus(string $status): Collection;

    /**
     * Get projects with opportunities
     */
    public function getProjectsWithOpportunities(int $customerId): Collection;

    /**
     * Get projects by location
     */
    public function getProjectsByLocation(string $location): Collection;

    /**
     * Get projects within budget range
     */
    public function getProjectsByBudgetRange(float $minBudget, float $maxBudget): Collection;

    /**
     * Get projects by service types
     */
    public function getProjectsByServiceTypes(array $serviceTypeIds): Collection;

    /**
     * Search projects
     */
    public function searchProjects(string $term, array $filters = []): LengthAwarePaginator;

    /**
     * Get project statistics
     */
    public function getProjectStatistics(): array;

    /**
     * Get recent projects
     */
    public function getRecentProjects(int $limit = 10): Collection;

    /**
     * Get featured projects
     */
    public function getFeaturedProjects(int $limit = 6): Collection;
}