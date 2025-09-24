<?php

namespace App\Events;

use App\Models\ProjectOpportunity;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ProjectOpportunity $opportunity;

    /**
     * Create a new event instance.
     */
    public function __construct(ProjectOpportunity $opportunity)
    {
        $this->opportunity = $opportunity->load(['project', 'professional']);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('customer.' . $this->opportunity->project->customer_id),
            new PrivateChannel('project.' . $this->opportunity->project_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'opportunity_id' => $this->opportunity->id,
            'project_id' => $this->opportunity->project_id,
            'professional_name' => $this->opportunity->professional->first_name . ' ' . $this->opportunity->professional->last_name,
            'bid_amount' => $this->opportunity->bid_amount,
            'message' => 'New bid received for your project: ' . $this->opportunity->project->title,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'bid.submitted';
    }
}
