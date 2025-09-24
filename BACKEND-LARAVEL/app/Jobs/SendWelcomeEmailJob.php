<?php

namespace App\Jobs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public Model $user;
    public string $userType;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The maximum number of seconds to allow before timing out.
     */
    public int $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(Model $user, string $userType)
    {
        $this->user = $user;
        $this->userType = $userType;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $emailData = [
                'user' => $this->user,
                'userType' => $this->userType,
                'loginUrl' => config('app.frontend_url') . '/login',
                'dashboardUrl' => config('app.frontend_url') . '/dashboard'
            ];

            // Choose email template based on user type
            $template = match($this->userType) {
                'customer' => 'emails.welcome.customer',
                'professional' => 'emails.welcome.professional',
                'realtor' => 'emails.welcome.realtor',
                default => 'emails.welcome.default'
            };

            Mail::send($template, $emailData, function ($message) {
                $message->to($this->user->email, $this->user->first_name . ' ' . $this->user->last_name)
                       ->subject('Welcome to ' . config('app.name') . '!');
            });

            Log::info('Welcome email sent successfully', [
                'user_id' => $this->user->id,
                'user_type' => $this->userType,
                'email' => $this->user->email
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $this->user->id,
                'user_type' => $this->userType,
                'error' => $e->getMessage()
            ]);

            throw $e; // Re-throw to trigger retry mechanism
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Welcome email job failed permanently', [
            'user_id' => $this->user->id,
            'user_type' => $this->userType,
            'error' => $exception->getMessage()
        ]);
    }
}
