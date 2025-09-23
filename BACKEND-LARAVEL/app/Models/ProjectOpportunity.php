<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectOpportunity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'professional_id',
        'customer_id',
        'status',
        'bid_amount',
        'estimated_completion_days',
        'notes',
        'submitted_at',
        'accepted_at',
        'rejected_at'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bid_amount' => 'decimal:2',
            'estimated_completion_days' => 'integer',
            'submitted_at' => 'datetime',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByProfessional($query, $professionalId)
    {
        return $query->where('professional_id', $professionalId);
    }

    public function scopeByProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}