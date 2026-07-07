<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        Vendor::firstOrCreate(
            ['email' => 'contact@ptmaju.com'],
            ['name' => 'PT Maju Bersama', 'contact_person' => 'Budi Santoso', 'phone' => '081234567890']
        );

        Vendor::firstOrCreate(
            ['email' => 'info@techsolusi.com'],
            ['name' => 'Tech Solusi Nusantara', 'contact_person' => 'Siti Aminah', 'phone' => '081987654321']
        );
    }
}
