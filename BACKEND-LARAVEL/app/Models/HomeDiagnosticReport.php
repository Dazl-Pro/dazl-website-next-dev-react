<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeDiagnosticReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'client_email',
        'street_no',
        'street_name',
        'city',
        'state',
        'zip_code',
        'highest_price',
        'lowest_price',
        'year_built',
        'bathrooms',
        'bedrooms',
        'basement',
        'gross_size',
        'spaces',
        'parking_features',
        'property_stories',
        'structure_type',
        'lot_size',
        'location',
        'foundation_type',
        'tax_accessed_value',
        'annual_tax_amount',
        'sale_date',
        'sale_amount',
        'type',
        'phd_description',
        'realtor_id',
        'customer_id'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'highest_price' => 'decimal:2',
            'lowest_price' => 'decimal:2',
            'tax_accessed_value' => 'decimal:2',
            'annual_tax_amount' => 'decimal:2',
            'sale_amount' => 'decimal:2',
            'sale_date' => 'date',
            'year_built' => 'integer',
            'bathrooms' => 'integer',
            'bedrooms' => 'integer',
        ];
    }

    // Relationships
    public function realtor()
    {
        return $this->belongsTo(Realtor::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getFullAddressAttribute()
    {
        return $this->street_no . ' ' . $this->street_name . ', ' . $this->city . ', ' . $this->state . ' ' . $this->zip_code;
    }

    public function getPriceRangeAttribute()
    {
        if ($this->lowest_price && $this->highest_price) {
            return '$' . number_format($this->lowest_price) . ' - $' . number_format($this->highest_price);
        }
        return null;
    }

    // Scopes
    public function scopeByRealtor($query, $realtorId)
    {
        return $query->where('realtor_id', $realtorId);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByLocation($query, $city, $state = null)
    {
        $query->where('city', $city);
        if ($state) {
            $query->where('state', $state);
        }
        return $query;
    }
}