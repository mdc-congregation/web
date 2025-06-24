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
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->enum('service_type', ['sms', 'email', 'payment', 'calendar', 'accounting', 'other']);
            $table->string('provider_name'); // e.g., 'Twilio', 'Vonage', 'MessageBird'
            $table->string('service_name'); // Display name for the service
            $table->json('configuration'); // Store API keys, endpoints, etc. (encrypted)
            $table->boolean('is_active')->default(false);
            $table->boolean('is_primary')->default(false); // Primary provider for this service type
            $table->datetime('last_used_at')->nullable();
            $table->json('usage_stats')->nullable(); // Track usage statistics
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['church_id', 'service_type', 'is_active']);
            $table->unique(['church_id', 'service_type', 'is_primary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
