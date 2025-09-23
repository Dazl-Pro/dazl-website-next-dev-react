<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Repository Interfaces
use App\Repositories\Interfaces\BaseRepositoryInterface;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;

// Repository Implementations
use App\Repositories\BaseRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\ProfessionalRepository;
use App\Repositories\RealtorRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind Project Repository
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);

        // Bind User Repositories
        $this->app->bind('CustomerRepository', CustomerRepository::class);
        $this->app->bind('ProfessionalRepository', ProfessionalRepository::class);
        $this->app->bind('RealtorRepository', RealtorRepository::class);

        // You can also bind specific interfaces if needed
        $this->app->when(CustomerRepository::class)
                  ->needs(UserRepositoryInterface::class)
                  ->give(CustomerRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}