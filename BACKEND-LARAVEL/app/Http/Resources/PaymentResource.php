<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'amount' => $this->amount,
            'formatted_amount' => $this->formatted_amount,
            'currency' => $this->currency,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'description' => $this->description,
            'metadata' => $this->metadata,

            // Stripe information (hide sensitive data)
            'stripe_payment_intent_id' => $this->stripe_payment_intent_id,

            // Relationships (IDs only to avoid circular references)
            'project_id' => $this->project_id,
            'userable_type' => $this->userable_type,
            'userable_id' => $this->userable_id,

            // Related data when loaded
            'project' => new ProjectResource($this->whenLoaded('project')),

            // Timestamps
            'payment_date' => $this->payment_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Human readable dates
            'payment_date_human' => $this->payment_date?->format('F j, Y g:i A'),
            'processed_at' => $this->created_at->diffForHumans(),
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
                'type' => 'payment',
                'version' => '1.0',
            ],
        ];
    }
}