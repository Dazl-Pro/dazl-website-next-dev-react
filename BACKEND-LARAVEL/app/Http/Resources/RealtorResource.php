<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RealtorResource extends JsonResource
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

            // Agency Information
            'real_state_agency_name' => $this->real_state_agency_name,
            'city_of_real_state_agency' => $this->city_of_real_state_agency,
            'state' => $this->state,
            'zip_code' => $this->zip_code,

            // Relationships
            'home_diagnostic_reports' => HomeDiagnosticReportResource::collection($this->whenLoaded('homeDiagnosticReports')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            // Counts
            'reports_count' => $this->when(
                $this->relationLoaded('homeDiagnosticReports'),
                fn() => $this->homeDiagnosticReports->count()
            ),
            'projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->count()
            ),

            // Performance Metrics
            'total_reports_created' => $this->getTotalReportsCreated(),
            'total_projects_initiated' => $this->getTotalProjectsInitiated(),
            'profile_completion' => $this->getProfileCompletion(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'member_since' => $this->created_at->format('F Y'),
            'last_active' => $this->updated_at->diffForHumans(),
        ];
    }

    /**
     * Get total reports created
     */
    private function getTotalReportsCreated(): int
    {
        if ($this->relationLoaded('homeDiagnosticReports')) {
            return $this->homeDiagnosticReports->count();
        }

        return 0;
    }

    /**
     * Get total projects initiated
     */
    private function getTotalProjectsInitiated(): int
    {
        if ($this->relationLoaded('projects')) {
            return $this->projects->count();
        }

        return 0;
    }

    /**
     * Calculate profile completion percentage
     */
    private function getProfileCompletion(): int
    {
        $fields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'real_state_agency_name', 'city_of_real_state_agency',
            'state', 'zip_code'
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
                'type' => 'realtor',
                'version' => '1.0',
            ],
        ];
    }
}