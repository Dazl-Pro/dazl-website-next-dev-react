<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectOpportunityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'bid_amount' => $this->bid_amount,
            'estimated_completion_days' => $this->estimated_completion_days,
            'notes' => $this->notes,

            // Relationships (only IDs to avoid circular references)
            'project_id' => $this->project_id,
            'professional_id' => $this->professional_id,
            'customer_id' => $this->customer_id,

            // Related data when loaded
            'project' => new ProjectResource($this->whenLoaded('project')),
            'professional' => new ProfessionalResource($this->whenLoaded('professional')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),

            // Formatted data
            'formatted_bid_amount' => $this->bid_amount ? '$' . number_format($this->bid_amount, 2) : null,
            'completion_estimate' => $this->estimated_completion_days ?
                $this->estimated_completion_days . ' days' : null,

            // Timestamps
            'submitted_at' => $this->submitted_at,
            'accepted_at' => $this->accepted_at,
            'rejected_at' => $this->rejected_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Human readable dates
            'submitted_at_human' => $this->submitted_at?->diffForHumans(),
            'accepted_at_human' => $this->accepted_at?->diffForHumans(),
            'rejected_at_human' => $this->rejected_at?->diffForHumans(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'type' => 'project_opportunity',
                'version' => '1.0',
            ],
        ];
    }
}