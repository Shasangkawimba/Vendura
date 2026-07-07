<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\User;
use App\Models\Vendor;
use App\Enums\ContractStatus;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        $manager = User::where('email', 'manager@vendura.test')->first();
        $vendor1 = Vendor::where('email', 'contact@ptmaju.com')->first();
        $vendor2 = Vendor::where('email', 'info@techsolusi.com')->first();

        Contract::firstOrCreate(
            ['title' => 'Pengadaan Laptop 2026'],
            [
                'vendor_id' => $vendor1->id,
                'created_by' => $manager->id,
                'value' => 150000000,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addMonths(6)->toDateString(),
                'status' => ContractStatus::DRAFT,
            ]
        );

        Contract::firstOrCreate(
            ['title' => 'Lisensi Software Cloud'],
            [
                'vendor_id' => $vendor2->id,
                'created_by' => $manager->id,
                'value' => 50000000,
                'start_date' => now()->subMonth()->toDateString(),
                'end_date' => now()->addYears(1)->toDateString(),
                'status' => ContractStatus::AKTIF,
            ]
        );
    }
}
