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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['small_group', 'ministry', 'committee', 'choir', 'youth', 'children', 'mens', 'womens', 'seniors', 'other']);
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->foreignId('leader_id')->nullable()->constrained('members')->onDelete('set null');
            $table->foreignId('co_leader_id')->nullable()->constrained('members')->onDelete('set null');
            $table->string('meeting_day')->nullable(); // e.g., 'Sunday', 'Wednesday'
            $table->time('meeting_time')->nullable();
            $table->string('meeting_location')->nullable();
            $table->enum('meeting_frequency', ['weekly', 'bi_weekly', 'monthly', 'quarterly', 'as_needed'])->default('weekly');
            $table->integer('max_capacity')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->json('requirements')->nullable(); // Age, gender, or other requirements
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['church_id', 'type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
