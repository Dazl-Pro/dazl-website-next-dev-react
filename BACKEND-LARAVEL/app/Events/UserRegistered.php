<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserRegistered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Model $user;
    public string $userType;

    /**
     * Create a new event instance.
     */
    public function __construct(Model $user, string $userType)
    {
        $this->user = $user;
        $this->userType = $userType; // 'customer', 'professional', or 'realtor'
    }
}
