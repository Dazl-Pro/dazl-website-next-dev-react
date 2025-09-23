<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionalResource extends JsonResource
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

            // Company Information
            'company_name' => $this->company_name,
            'company_street_address' => $this->company_street_address,
            'company_city' => $this->company_city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'company_number' => $this->company_number,
            'years' => $this->years,

            // Professional Details
            'business_licence' => $this->business_licence,
            'insurance_licence' => $this->insurance_licence,
            'project_portfolio' => $this->project_portfolio,
            'website' => $this->website,

            // Relationships
            'company' => new CompanyResource($this->whenLoaded('company')),
            'service_types' => ServiceTypeResource::collection($this->whenLoaded('serviceTypes')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'portfolio_images' => PortfolioImageResource::collection($this->whenLoaded('portfolioImages')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            // Counts
            'projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->count()
            ),
            'completed_projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->where('status', 'completed')->count()
            ),
            'portfolio_images_count' => $this->when(
                $this->relationLoaded('portfolioImages'),
                fn() => $this->portfolioImages->count()
            ),
            'service_types_count' => $this->when(
                $this->relationLoaded('serviceTypes'),
                fn() => $this->serviceTypes->count()
            ),

            // Professional Statistics
            'average_rating' => $this->getAverageRating(),
            'total_earnings' => $this->getTotalEarnings(),
            'profile_completion' => $this->getProfileCompletion(),
            'verification_status' => $this->getVerificationStatus(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'member_since' => $this->created_at->format('F Y'),
            'last_active' => $this->updated_at->diffForHumans(),
        ];
    }

    /**
     * Calculate average rating (placeholder - would come from reviews)
     */
    private function getAverageRating(): ?float
    {
        // TODO: Implement when review system is added
        return null;
    }

    /**
     * Calculate total earnings
     */
    private function getTotalEarnings(): float
    {
        if ($this->relationLoaded('payments')) {
            return $this->payments
                ->where('payment_status', 'completed')
                ->sum('amount');
        }

        return 0.0;
    }

    /**
     * Calculate profile completion percentage
     */
    private function getProfileCompletion(): int
    {
        $fields = [
            'first_name', 'last_name', 'email', 'phone_number',
            'company_name', 'company_city', 'state', 'zip_code',
            'company_number', 'years', 'business_licence', 'insurance_licence'
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
     * Get verification status
     */
    private function getVerificationStatus(): array
    {
        return [
            'email_verified' => !empty($this->email_verified_at),
            'phone_verified' => false, // TODO: Implement phone verification
            'license_verified' => !empty($this->business_licence),
            'insurance_verified' => !empty($this->insurance_licence),
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
                'type' => 'professional',
                'version' => '1.0',
            ],
        ];
    }
}