<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withProviders([
        \App\Providers\RepositoryServiceProvider::class,
        \App\Providers\EventServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        // Register custom middleware aliases
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'project.ownership' => \App\Http\Middleware\ProjectOwnershipMiddleware::class,
            'log.api' => \App\Http\Middleware\LogApiRequestsMiddleware::class,
            'jwt:customer' => \App\Http\Middleware\JwtCustomerMiddleware::class,
            'jwt:professional' => \App\Http\Middleware\JwtProfessionalMiddleware::class,
            'jwt:realtor' => \App\Http\Middleware\JwtRealtorMiddleware::class,
        ]);

        // Apply API logging to all API routes
        $middleware->group('api', [
            'log.api',
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
