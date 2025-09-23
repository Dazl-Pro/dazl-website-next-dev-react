<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioImageResource extends JsonResource
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
            'url' => $this->url,
            'full_url' => $this->full_url,
            'title' => $this->title,
            'description' => $this->description,
            'alt_text' => $this->alt_text,
            'category' => $this->category,
            'sort_order' => $this->sort_order,
            'is_featured' => $this->is_featured,

            // Professional relationship (only ID to avoid circular reference)
            'professional_id' => $this->professional_id,

            // Image metadata
            'file_type' => $this->getFileType(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'uploaded_at' => $this->created_at->format('F j, Y'),
        ];
    }

    /**
     * Get file type from URL
     */
    private function getFileType(): ?string
    {
        $extension = pathinfo($this->url, PATHINFO_EXTENSION);
        return strtoupper($extension);
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
                'type' => 'portfolio_image',
                'version' => '1.0',
            ],
        ];
    }
}