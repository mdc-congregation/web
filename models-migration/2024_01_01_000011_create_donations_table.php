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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('finance_event_id')->nullable()->constrained()->onDelete('set null');
            $table->string('donor_name')->nullable(); // For anonymous or non-member donations
            $table->decimal('amount', 12, 2);
            $table->enum('type', ['tithe', 'offering', 'special_offering', 'donation', 'pledge', 'other']);
            $table->enum('payment_method', ['cash', 'check', 'bank_transfer', 'online_payment', 'mobile_money', 'other']);
            $table->string('reference_number')->nullable(); // Check number, transaction ID, etc.
            $table->date('donation_date');
            $table->text('purpose')->nullable(); // What the donation is for
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_frequency', ['weekly', 'monthly', 'quarterly', 'yearly'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['church_id', 'donation_date', 'type']);
            $table->index(['member_id', 'donation_date']);
            $table->index(['finance_event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
