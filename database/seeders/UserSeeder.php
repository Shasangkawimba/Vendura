<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@vendura.test'],
            ['name' => 'System Admin', 'password' => Hash::make('password'), 'role' => UserRole::ADMIN]
        );

        User::firstOrCreate(
            ['email' => 'manager@vendura.test'],
            ['name' => 'Manager Procurement', 'password' => Hash::make('password'), 'role' => UserRole::MANAGER]
        );

        User::firstOrCreate(
            ['email' => 'finance@vendura.test'],
            ['name' => 'Finance Officer', 'password' => Hash::make('password'), 'role' => UserRole::FINANCE]
        );

        User::firstOrCreate(
            ['email' => 'direktur@vendura.test'],
            ['name' => 'Direktur Utama', 'password' => Hash::make('password'), 'role' => UserRole::DIREKTUR]
        );
    }
}
