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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->string('location');
            $table->enum('status', ['draft', 'published', 'in_progress', 'completed', 'cancelled'])->default('draft');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('professional_id')->nullable()->constrained('professionals')->onDelete('set null');
            $table->foreignId('realtor_id')->nullable()->constrained('realtors')->onDelete('set null');
            $table->foreignId('home_diagnostic_report_id')->nullable()->constrained('home_diagnostic_reports')->onDelete('cascade');
            $table->boolean('is_featured')->default(false);
            $table->json('service_type_ids')->nullable(); // Store array of service type IDs
            $table->timestamp('published_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('completion_notes')->nullable();
            $table->decimal('final_cost', 10, 2)->nullable();
            $table->integer('estimated_duration_days')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['customer_id']);
            $table->index(['professional_id']);
            $table->index(['realtor_id']);
            $table->index(['status']);
            $table->index(['is_featured']);
            $table->index(['published_at']);
            $table->index(['location']);
            $table->index(['budget_min', 'budget_max']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
