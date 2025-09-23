<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'budget_min' => $this->budget_min,
            'budget_max' => $this->budget_max,
            'budget_range' => $this->budget_range,
            'location' => $this->location,
            'status' => $this->status,
            'estimated_completion_date' => $this->estimated_completion_date,
            'actual_completion_date' => $this->actual_completion_date,

            // Relationships
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'realtor' => new RealtorResource($this->whenLoaded('realtor')),
            'professional' => new ProfessionalResource($this->whenLoaded('professional')),
            'home_diagnostic_report' => new HomeDiagnosticReportResource($this->whenLoaded('homeDiagnosticReport')),

            // Collections
            'images' => ProjectImageResource::collection($this->whenLoaded('projectImages')),
            'opportunities' => ProjectOpportunityResource::collection($this->whenLoaded('projectOpportunities')),
            'service_types' => ServiceTypeResource::collection($this->whenLoaded('serviceTypes')),

            // Counts
            'images_count' => $this->when(
                $this->relationLoaded('projectImages'),
                fn() => $this->projectImages->count()
            ),
            'opportunities_count' => $this->when(
                $this->relationLoaded('projectOpportunities'),
                fn() => $this->projectOpportunities->count()
            ),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'updated_at_human' => $this->updated_at->diffForHumans(),
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
                'type' => 'project',
                'version' => '1.0',
            ],
        ];
    }
}