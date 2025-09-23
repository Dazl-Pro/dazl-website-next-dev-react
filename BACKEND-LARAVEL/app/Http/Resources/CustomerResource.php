<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'zip_code' => $this->zip_code,

            // Relationships
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'home_diagnostic_reports' => HomeDiagnosticReportResource::collection($this->whenLoaded('homeDiagnosticReports')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            // Counts
            'projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->count()
            ),
            'reports_count' => $this->when(
                $this->relationLoaded('homeDiagnosticReports'),
                fn() => $this->homeDiagnosticReports->count()
            ),

            // Profile completion
            'profile_completion' => $this->getProfileCompletion(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'member_since' => $this->created_at->format('F Y'),
            'last_active' => $this->updated_at->diffForHumans(),
        ];
    }

    /**
     * Calculate profile completion percentage
     */
    private function getProfileCompletion(): int
    {
        $fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'zip_code'
        ];

        $completed = 0;
        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $completed++;
            }
        }

        return round(($completed / count($fields)) * 100);
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
                'type' => 'customer',
                'version' => '1.0',
            ],
        ];
    }
}