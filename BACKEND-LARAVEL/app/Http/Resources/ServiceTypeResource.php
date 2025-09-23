<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceTypeResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,

            // Relationships (counts only to avoid large datasets)
            'professionals_count' => $this->when(
                $this->relationLoaded('professionals'),
                fn() => $this->professionals->count()
            ),
            'projects_count' => $this->when(
                $this->relationLoaded('projects'),
                fn() => $this->projects->count()
            ),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
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
                'type' => 'service_type',
                'version' => '1.0',
            ],
        ];
    }
}