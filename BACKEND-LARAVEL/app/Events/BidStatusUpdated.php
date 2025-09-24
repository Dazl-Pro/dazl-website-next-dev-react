<?php

namespace App\Events;

use App\Models\ProjectOpportunity;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ProjectOpportunity $opportunity;
    public string $previousStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(ProjectOpportunity $opportunity, string $previousStatus = null)
    {
        $this->opportunity = $opportunity->load(['project', 'professional']);
        $this->previousStatus = $previousStatus ?? 'unknown';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // Notify the professional who submitted the bid
            new PrivateChannel('professional.' . $this->opportunity->professional_id),

            // Notify the customer who owns the project
            new PrivateChannel('customer.' . $this->opportunity->project->customer_id),

            // General project channel for real-time updates
            new Channel('project.' . $this->opportunity->project_id)
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'bid.status.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'opportunity_id' => $this->opportunity->id,
            'project_id' => $this->opportunity->project_id,
            'professional_id' => $this->opportunity->professional_id,
            'status' => $this->opportunity->status,
            'previous_status' => $this->previousStatus,
            'bid_amount' => $this->opportunity->bid_amount,
            'professional_name' => $this->opportunity->professional->full_name ?? 'Unknown',
            'project_title' => $this->opportunity->project->title ?? 'Untitled Project',
            'message' => $this->getBroadcastMessage(),
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Get user-friendly message for the status update
     */
    private function getBroadcastMessage(): string
    {
        $professionalName = $this->opportunity->professional->full_name ?? 'A professional';
        $projectTitle = $this->opportunity->project->title ?? 'your project';

        return match($this->opportunity->status) {
            'accepted' => "{$professionalName}'s bid has been accepted for {$projectTitle}",
            'rejected' => "{$professionalName}'s bid has been rejected for {$projectTitle}",
            'withdrawn' => "{$professionalName} has withdrawn their bid for {$projectTitle}",
            'updated' => "{$professionalName} has updated their bid for {$projectTitle}",
            default => "Bid status has been updated for {$projectTitle}"
        };
    }
}