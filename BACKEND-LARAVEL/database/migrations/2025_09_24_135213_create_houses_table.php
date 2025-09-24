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
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('bathrooms');
            $table->integer('bedrooms');
            $table->string('basement')->nullable();
            $table->string('year_built')->nullable();
            $table->string('gross_size')->nullable();
            $table->string('spaces')->nullable();
            $table->string('parking_features')->nullable();
            $table->string('property_stories')->nullable();
            $table->string('structure_type')->nullable();
            $table->string('lot_size')->nullable();
            $table->string('location')->nullable();
            $table->string('foundation_type')->nullable();
            $table->string('tax_accessed_value')->nullable();
            $table->string('annual_tax_amount')->nullable();
            $table->string('sale_date')->nullable();
            $table->string('sale_amount')->nullable();
            $table->string('type')->nullable();
            $table->longText('address')->nullable();
            $table->foreignId('realtor_id')->constrained('realtors');
            $table->foreignId('customer_id')->constrained('customers');
            $table->timestamps();

            // Indexes for performance
            $table->index(['realtor_id', 'customer_id']);
            $table->index(['location']);
            $table->index(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
