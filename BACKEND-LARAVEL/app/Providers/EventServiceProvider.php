<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

// Events
use App\Events\UserRegistered;
use App\Events\ProjectCreated;
use App\Events\BidSubmitted;
use App\Events\PaymentProcessed;

// Listeners
use App\Listeners\SendWelcomeEmail;
use App\Listeners\NotifyProfessionalsOfNewProject;
use App\Listeners\SendBidNotification;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserRegistered::class => [
            SendWelcomeEmail::class,
        ],

        ProjectCreated::class => [
            NotifyProfessionalsOfNewProject::class,
        ],

        BidSubmitted::class => [
            SendBidNotification::class,
        ],

        PaymentProcessed::class => [
            // Add payment-related listeners here
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false; // Set to true to auto-discover events
    }
}