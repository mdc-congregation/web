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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->foreignId('communication_event_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('recipient_id')->nullable()->constrained('members')->onDelete('cascade');
            $table->string('recipient_email')->nullable();
            $table->string('recipient_phone')->nullable();
            $table->string('recipient_name')->nullable();
            $table->enum('type', ['email', 'sms']);
            $table->string('subject')->nullable(); // For emails only
            $table->text('content');
            $table->datetime('scheduled_at')->nullable();
            $table->datetime('sent_at')->nullable();
            $table->datetime('delivered_at')->nullable();
            $table->datetime('read_at')->nullable(); // For email read receipts
            $table->enum('status', ['pending', 'scheduled', 'sent', 'delivered', 'failed', 'bounced']);
            $table->text('failure_reason')->nullable();
            $table->string('external_id')->nullable(); // ID from SMS/Email provider
            $table->decimal('cost', 8, 4)->nullable(); // Cost for SMS
            $table->timestamps();
            
            $table->index(['church_id', 'status', 'sent_at']);
            $table->index(['communication_event_id', 'status']);
            $table->index(['recipient_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
