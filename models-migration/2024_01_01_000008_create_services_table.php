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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['sunday_service', 'midweek_service', 'prayer_meeting', 'bible_study', 'youth_service', 'special_event', 'conference', 'crusade', 'other']);
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->foreignId('leader_id')->nullable()->constrained('members')->onDelete('set null');
            $table->json('speakers')->nullable(); // Array of speaker information
            $table->json('worship_leaders')->nullable(); // Array of worship leader information
            $table->text('sermon_topic')->nullable();
            $table->text('sermon_notes')->nullable();
            $table->integer('expected_attendance')->nullable();
            $table->integer('actual_attendance')->nullable();
            $table->text('announcement_message')->nullable(); // Message for SMS/Email reminders
            
            // Recurring Service Information
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurrence_type', ['weekly', 'bi_weekly', 'monthly'])->nullable();
            $table->json('recurrence_days')->nullable(); // Days of week for weekly services
            $table->date('recurrence_end_date')->nullable();
            
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['church_id', 'start_date', 'status']);
            $table->index(['church_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
