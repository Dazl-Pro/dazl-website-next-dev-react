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
        Schema::create('professionals', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number')->nullable();
            $table->string('company_name');
            $table->string('company_street_address')->nullable();
            $table->string('company_city');
            $table->string('state');
            $table->string('zip_code');
            $table->string('company_number');
            $table->string('years'); // Years of experience
            $table->text('business_licence')->nullable();
            $table->text('insurance_licence')->nullable();
            $table->text('project_portfolio')->nullable();
            $table->string('website')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->string('profile_image')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Indexes
            $table->index(['email']);
            $table->index(['is_active']);
            $table->index(['is_verified']);
            $table->index(['state', 'company_city']);
            $table->index(['average_rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
