<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Professional extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'company_name',
        'company_street_address',
        'company_city',
        'state',
        'zip_code',
        'email',
        'password',
        'company_id',
        'business_licence',
        'insurance_licence',
        'project_portfolio',
        'website',
        'company_number',
        'years'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relationships
    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'userable');
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function portfolioImages()
    {
        return $this->hasMany(PortfolioImage::class);
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}