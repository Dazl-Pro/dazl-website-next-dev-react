<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeDiagnosticReportResource extends JsonResource
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

            // Client Information
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'client_email' => $this->client_email,

            // Property Address
            'street_no' => $this->street_no,
            'street_name' => $this->street_name,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'location' => $this->location,
            'full_address' => $this->full_address,

            // Price Information
            'highest_price' => $this->highest_price,
            'lowest_price' => $this->lowest_price,
            'price_range' => $this->price_range,

            // Property Details
            'year_built' => $this->year_built,
            'bathrooms' => $this->bathrooms,
            'bedrooms' => $this->bedrooms,
            'basement' => $this->basement,
            'gross_size' => $this->gross_size,
            'spaces' => $this->spaces,
            'parking_features' => $this->parking_features,
            'property_stories' => $this->property_stories,
            'structure_type' => $this->structure_type,
            'lot_size' => $this->lot_size,
            'foundation_type' => $this->foundation_type,
            'type' => $this->type,

            // Financial Information
            'tax_accessed_value' => $this->tax_accessed_value,
            'annual_tax_amount' => $this->annual_tax_amount,
            'sale_date' => $this->sale_date,
            'sale_amount' => $this->sale_amount,

            // PHD Information
            'phd_description' => $this->phd_description,

            // Relationships
            'realtor' => new RealtorResource($this->whenLoaded('realtor')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),

            // Counts
            'projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->count()
            ),

            // Property Summary
            'property_summary' => $this->getPropertySummary(),
            'financial_summary' => $this->getFinancialSummary(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'report_date' => $this->created_at->format('F j, Y'),
        ];
    }

    /**
     * Get property summary
     */
    private function getPropertySummary(): array
    {
        return [
            'bedrooms_bathrooms' => $this->bedrooms . ' bed / ' . $this->bathrooms . ' bath',
            'year_built' => $this->year_built,
            'property_age' => now()->year - $this->year_built . ' years old',
            'structure_type' => $this->structure_type,
            'foundation_type' => $this->foundation_type,
            'lot_size' => $this->lot_size,
            'gross_size' => $this->gross_size,
        ];
    }

    /**
     * Get financial summary
     */
    private function getFinancialSummary(): array
    {
        return [
            'estimated_value_range' => $this->price_range,
            'tax_assessed_value' => '$' . number_format($this->tax_accessed_value),
            'annual_taxes' => '$' . number_format($this->annual_tax_amount),
            'last_sale' => [
                'date' => $this->sale_date ? $this->sale_date->format('F j, Y') : null,
                'amount' => '$' . number_format($this->sale_amount),
                'years_ago' => $this->sale_date ? $this->sale_date->diffInYears(now()) : null,
            ],
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
                'type' => 'home_diagnostic_report',
                'version' => '1.0',
            ],
        ];
    }
}