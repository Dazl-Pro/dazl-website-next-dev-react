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
        Schema::create('professional_service_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')->constrained('professionals')->onDelete('cascade');
            $table->foreignId('service_type_id')->constrained('service_types')->onDelete('cascade');
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->text('specialization_notes')->nullable();
            $table->integer('years_experience')->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['professional_id', 'service_type_id']);

            // Indexes for performance
            $table->index(['professional_id']);
            $table->index(['service_type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_service_type');
    }
};
