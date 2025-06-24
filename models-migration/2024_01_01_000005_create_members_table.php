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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->onDelete('cascade');
            $table->string('member_id')->unique(); // Custom member ID
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            $table->string('occupation')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->date('join_date');
            $table->enum('membership_status', ['active', 'inactive', 'transferred', 'deceased'])->default('active');
            $table->json('ministries')->nullable(); // Array of ministry involvements
            $table->text('notes')->nullable();
            $table->string('photo_url')->nullable();
            
            // Baptism Information
            $table->boolean('is_baptized')->default(false);
            $table->date('baptism_date')->nullable();
            $table->string('baptism_location')->nullable();
            
            // Family Information
            $table->foreignId('spouse_id')->nullable()->constrained('members')->onDelete('set null');
            $table->json('children_ids')->nullable(); // Array of member IDs for children
            
            $table->timestamps();
            
            $table->index(['church_id', 'membership_status']);
            $table->index(['church_id', 'join_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
