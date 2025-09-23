<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'state',
        'zip_code',
        'phone',
        'email',
        'website',
        'logo_url',
        'business_license',
        'insurance_info',
        'is_active'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function professionals()
    {
        return $this->hasMany(Professional::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLocation($query, $city, $state = null)
    {
        $query->where('city', $city);
        if ($state) {
            $query->where('state', $state);
        }
        return $query;
    }

    // Accessors
    public function getFullAddressAttribute()
    {
        return $this->address . ', ' . $this->city . ', ' . $this->state . ' ' . $this->zip_code;
    }
}