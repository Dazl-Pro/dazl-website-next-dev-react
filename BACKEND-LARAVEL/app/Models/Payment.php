<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userable_id',
        'userable_type',
        'project_id',
        'amount',
        'currency',
        'payment_method',
        'payment_status',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'payment_date',
        'description',
        'metadata'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'datetime',
            'metadata' => 'array',
        ];
    }

    // Relationships
    public function userable()
    {
        return $this->morphTo();
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeSuccessful($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }

    // Accessors
    public function getFormattedAmountAttribute()
    {
        return $this->currency . ' ' . number_format($this->amount, 2);
    }
}