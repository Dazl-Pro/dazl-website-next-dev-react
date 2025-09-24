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
        Schema::create('project_room', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->string('bid_status')->nullable();
            $table->integer('feature_id')->nullable();
            $table->longText('image_desc')->nullable();
            $table->longText('images')->nullable();
            $table->longText('inspection_notes')->nullable();
            $table->string('status')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['project_id', 'room_id']);

            // Indexes for performance
            $table->index(['project_id']);
            $table->index(['room_id']);
            $table->index(['bid_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_room');
    }
};
