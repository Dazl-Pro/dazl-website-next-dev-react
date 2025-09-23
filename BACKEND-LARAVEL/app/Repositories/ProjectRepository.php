<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProjectRepository extends BaseRepository implements ProjectRepositoryInterface
{
    /**
     * Get the model instance
     */
    protected function getModel(): Model
    {
        return new Project();
    }

    /**
     * Get projects for customer
     */
    public function getProjectsForCustomer(int $customerId): Collection
    {
        return $this->with(['projectImages', 'professional', 'projectOpportunities'])
                    ->where('customer_id', $customerId)
                    ->latest()
                    ->get();
    }

    /**
     * Get published projects
     */
    public function getPublishedProjects(): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->where('status', 'published')
                    ->latest()
                    ->get();
    }

    /**
     * Get projects by status
     */
    public function getProjectsByStatus(string $status): Collection
    {
        return $this->with(['customer', 'professional', 'projectImages'])
                    ->where('status', $status)
                    ->latest()
                    ->get();
    }

    /**
     * Get projects with opportunities
     */
    public function getProjectsWithOpportunities(int $customerId): Collection
    {
        return $this->with(['projectOpportunities.professional', 'projectImages'])
                    ->where('customer_id', $customerId)
                    ->whereHas('projectOpportunities')
                    ->latest()
                    ->get();
    }

    /**
     * Get projects by location
     */
    public function getProjectsByLocation(string $location): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->where('location', 'like', "%{$location}%")
                    ->where('status', 'published')
                    ->latest()
                    ->get();
    }

    /**
     * Get projects within budget range
     */
    public function getProjectsByBudgetRange(float $minBudget, float $maxBudget): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->where('status', 'published')
                    ->where(function ($query) use ($minBudget, $maxBudget) {
                        $query->whereBetween('budget_min', [$minBudget, $maxBudget])
                              ->orWhereBetween('budget_max', [$minBudget, $maxBudget])
                              ->orWhere(function ($q) use ($minBudget, $maxBudget) {
                                  $q->where('budget_min', '<=', $minBudget)
                                    ->where('budget_max', '>=', $maxBudget);
                              });
                    })
                    ->latest()
                    ->get();
    }

    /**
     * Get projects by service types
     */
    public function getProjectsByServiceTypes(array $serviceTypeIds): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->whereHas('serviceTypes', function ($query) use ($serviceTypeIds) {
                        $query->whereIn('service_types.id', $serviceTypeIds);
                    })
                    ->where('status', 'published')
                    ->latest()
                    ->get();
    }

    /**
     * Search projects
     */
    public function searchProjects(string $term, array $filters = []): LengthAwarePaginator
    {
        $this->with(['customer', 'projectImages', 'serviceTypes'])
             ->where('status', 'published')
             ->search($term, ['title', 'description', 'location']);

        // Apply filters
        if (!empty($filters['location'])) {
            $this->where('location', 'like', "%{$filters['location']}%");
        }

        if (!empty($filters['min_budget'])) {
            $this->where('budget_min', '>=', $filters['min_budget']);
        }

        if (!empty($filters['max_budget'])) {
            $this->where('budget_max', '<=', $filters['max_budget']);
        }

        if (!empty($filters['service_type_ids'])) {
            $this->query->whereHas('serviceTypes', function ($query) use ($filters) {
                $query->whereIn('service_types.id', $filters['service_type_ids']);
            });
        }

        return $this->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get project statistics
     */
    public function getProjectStatistics(): array
    {
        $totalProjects = $this->countBy();
        $publishedProjects = $this->countBy(['status' => 'published']);
        $draftProjects = $this->countBy(['status' => 'draft']);
        $completedProjects = $this->countBy(['status' => 'completed']);

        // Projects by status
        $projectsByStatus = Project::selectRaw('status, COUNT(*) as count')
                                 ->groupBy('status')
                                 ->pluck('count', 'status')
                                 ->toArray();

        // Projects by budget range
        $projectsByBudget = Project::selectRaw('
            CASE
                WHEN budget_max <= 1000 THEN "Under $1K"
                WHEN budget_max <= 5000 THEN "$1K - $5K"
                WHEN budget_max <= 10000 THEN "$5K - $10K"
                WHEN budget_max <= 25000 THEN "$10K - $25K"
                WHEN budget_max <= 50000 THEN "$25K - $50K"
                ELSE "Over $50K"
            END as budget_range,
            COUNT(*) as count
        ')
        ->groupBy('budget_range')
        ->pluck('count', 'budget_range')
        ->toArray();

        // Monthly project creation trend
        $monthlyProjects = Project::selectRaw('
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

        return [
            'total_projects' => $totalProjects,
            'published_projects' => $publishedProjects,
            'draft_projects' => $draftProjects,
            'completed_projects' => $completedProjects,
            'projects_by_status' => $projectsByStatus,
            'projects_by_budget' => $projectsByBudget,
            'monthly_trend' => $monthlyProjects,
            'average_budget' => Project::whereNotNull('budget_max')->avg('budget_max'),
            'total_budget_value' => Project::where('status', 'published')->sum('budget_max')
        ];
    }

    /**
     * Get recent projects
     */
    public function getRecentProjects(int $limit = 10): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->where('status', 'published')
                    ->latest()
                    ->limit($limit)
                    ->get();
    }

    /**
     * Get featured projects
     */
    public function getFeaturedProjects(int $limit = 6): Collection
    {
        return $this->with(['customer', 'projectImages'])
                    ->where('status', 'published')
                    ->where('is_featured', true)
                    ->latest()
                    ->limit($limit)
                    ->get();
    }
}