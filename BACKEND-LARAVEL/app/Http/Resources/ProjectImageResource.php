<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectImageResource extends JsonResource
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
            'description' => $this->description,
            'alt_text' => $this->alt_text,
            'sort_order' => $this->sort_order,

            // Project relationship (only ID to avoid circular reference)
            'project_id' => $this->project_id,

            // Image metadata
            'file_size' => $this->getFileSize(),
            'file_type' => $this->getFileType(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'uploaded_at' => $this->created_at->format('F j, Y g:i A'),
        ];
    }

    /**
     * Get file size (placeholder - would need to be stored or calculated)
     */
    private function getFileSize(): ?string
    {
        // TODO: Implement file size retrieval
        return null;
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
                'type' => 'project_image',
                'version' => '1.0',
            ],
        ];
    }
}