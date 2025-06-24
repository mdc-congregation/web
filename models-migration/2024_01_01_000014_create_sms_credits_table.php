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
        Schema::create('sms_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->integer('credits_purchased');
            $table->integer('credits_used')->default(0);
            $table->integer('credits_remaining');
            $table->decimal('cost_per_credit', 8, 4);
            $table->decimal('total_cost', 10, 2);
            $table->enum('payment_method', ['credit_card', 'bank_transfer', 'paypal', 'other']);
            $table->string('transaction_id')->nullable();
            $table->date('purchase_date');
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'expired', 'exhausted'])->default('active');
            $table->foreignId('purchased_by')->constrained('users')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['church_id', 'status']);
            $table->index(['church_id', 'expiry_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_credits');
    }
};
