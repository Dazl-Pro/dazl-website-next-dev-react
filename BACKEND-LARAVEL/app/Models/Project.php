<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'budget_min',
        'budget_max',
        'location',
        'status',
        'customer_id',
        'realtor_id',
        'professional_id',
        'home_diagnostic_report_id',
        'estimated_completion_date',
        'actual_completion_date',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
            'estimated_completion_date' => 'date',
            'actual_completion_date' => 'date',
        ];
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function realtor()
    {
        return $this->belongsTo(Realtor::class);
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    public function homeDiagnosticReport()
    {
        return $this->belongsTo(HomeDiagnosticReport::class);
    }

    public function projectImages()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function projectOpportunities()
    {
        return $this->hasMany(ProjectOpportunity::class);
    }

    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class);
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class)->withPivot('bid_status', 'feature_id');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByRealtor($query, $realtorId)
    {
        return $query->where('realtor_id', $realtorId);
    }

    public function scopeByProfessional($query, $professionalId)
    {
        return $query->where('professional_id', $professionalId);
    }

    // Accessors
    public function getBudgetRangeAttribute()
    {
        if ($this->budget_min && $this->budget_max) {
            return '$' . number_format($this->budget_min) . ' - $' . number_format($this->budget_max);
        }
        return null;
    }
}