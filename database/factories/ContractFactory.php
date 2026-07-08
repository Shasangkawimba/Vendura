<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContractFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'created_by' => User::factory(),
            'title' => fake()->sentence(),
            'value' => fake()->randomFloat(2, 1000, 100000),
            'start_date' => now(),
            'end_date' => now()->addYear(),
            'status' => 'DRAFT',
        ];
    }
}
