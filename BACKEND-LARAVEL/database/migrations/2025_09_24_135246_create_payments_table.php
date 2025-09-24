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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->morphs('userable'); // polymorphic relationship (customer_id, professional_id, realtor_id)
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('stripe_payment_id')->nullable();
            $table->string('stripe_customer_id')->nullable();
            $table->string('payment_method')->default('stripe');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->enum('type', ['subscription', 'one_time', 'commission'])->default('one_time');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['userable_type', 'userable_id']);
            $table->index(['status']);
            $table->index(['type']);
            $table->index(['stripe_payment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
