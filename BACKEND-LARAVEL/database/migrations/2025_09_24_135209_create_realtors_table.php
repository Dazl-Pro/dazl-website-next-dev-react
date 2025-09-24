<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('realtors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number');
            $table->string('real_state_agency_name');
            $table->string('city_of_real_state_agency')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('profile_image')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Indexes for performance
            $table->index(['email']);
            $table->index(['is_active']);
            $table->index(['state', 'city_of_real_state_agency']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realtors');
    }
};
