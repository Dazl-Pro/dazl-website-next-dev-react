<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use App\Jobs\SendWelcomeEmailJob;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(UserRegistered $event): void
    {
        // Dispatch a queued job to send welcome email
        SendWelcomeEmailJob::dispatch($event->user, $event->userType);
    }

    /**
     * Handle a job failure.
     */
    public function failed(UserRegistered $event, $exception): void
    {
        Log::error('Failed to send welcome email', [
            'user_id' => $event->user->id,
            'user_type' => $event->userType,
            'error' => $exception->getMessage()
        ]);
    }
}
