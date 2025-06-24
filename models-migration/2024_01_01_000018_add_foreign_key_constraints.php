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
        // Add self-referencing foreign key for spouse relationship in members table
        Schema::table('members', function (Blueprint $table) {
            $table->index(['spouse_id']);
        });
        
        // Add indexes for better performance
        Schema::table('donations', function (Blueprint $table) {
            $table->index(['church_id', 'type', 'donation_date']);
            $table->index(['member_id', 'type', 'donation_date']);
        });
        
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['church_id', 'type', 'status']);
            $table->index(['sent_at', 'status']);
        });
        
        Schema::table('service_attendance', function (Blueprint $table) {
            $table->index(['member_id', 'attended']);
        });
        
        Schema::table('group_members', function (Blueprint $table) {
            $table->index(['member_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes if needed
        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex(['spouse_id']);
        });
        
        Schema::table('donations', function (Blueprint $table) {
            $table->dropIndex(['church_id', 'type', 'donation_date']);
            $table->dropIndex(['member_id', 'type', 'donation_date']);
        });
        
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['church_id', 'type', 'status']);
            $table->dropIndex(['sent_at', 'status']);
        });
        
        Schema::table('service_attendance', function (Blueprint $table) {
            $table->dropIndex(['member_id', 'attended']);
        });
        
        Schema::table('group_members', function (Blueprint $table) {
            $table->dropIndex(['member_id', 'status']);
        });
    }
};
