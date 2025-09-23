<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'url',
        'description',
        'alt_text',
        'sort_order'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Accessors
    public function getFullUrlAttribute()
    {
        return asset('storage/' . $this->url);
    }

    // Scopes
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}