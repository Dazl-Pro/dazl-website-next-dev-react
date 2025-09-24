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
        Schema::create('home_diagnostic_reports', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('client_email');
            $table->string('street_no');
            $table->string('street_name');
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->decimal('highest_price', 10, 2)->nullable();
            $table->decimal('lowest_price', 10, 2)->nullable();
            $table->string('year_built')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->string('basement')->nullable();
            $table->string('gross_size')->nullable();
            $table->string('spaces')->nullable();
            $table->string('parking_features')->nullable();
            $table->string('property_stories')->nullable();
            $table->string('structure_type')->nullable();
            $table->string('lot_size')->nullable();
            $table->string('location')->nullable();
            $table->string('foundation_type')->nullable();
            $table->decimal('tax_accessed_value', 12, 2)->nullable();
            $table->decimal('annual_tax_amount', 10, 2)->nullable();
            $table->date('sale_date')->nullable();
            $table->decimal('sale_amount', 12, 2)->nullable();
            $table->string('type')->nullable();
            $table->text('phd_description')->nullable();
            $table->foreignId('realtor_id')->constrained('realtors');
            $table->foreignId('customer_id')->nullable()->constrained('customers');
            $table->timestamps();

            // Indexes for performance
            $table->index(['realtor_id']);
            $table->index(['customer_id']);
            $table->index(['city', 'state']);
            $table->index(['client_email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_diagnostic_reports');
    }
};
