<?php

namespace Tests\Feature;

use App\Enums\ContractStatus;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractApprovalFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_approval_flow_draft_to_aktif()
    {
        $creator = User::factory()->create(['role' => 'ADMIN']);
        $manager = User::factory()->create(['role' => 'MANAGER']);
        $finance = User::factory()->create(['role' => 'FINANCE']);
        $direktur = User::factory()->create(['role' => 'DIREKTUR']);

        $contract = Contract::factory()->create([
            'created_by' => $creator->id,
            'status' => ContractStatus::DRAFT
        ]);

        // 1. Submit
        $response = $this->actingAs($creator)->post("/contracts/{$contract->id}/submit");
        $response->assertRedirect();
        $this->assertEquals(ContractStatus::MENUNGGU_MANAGER, $contract->fresh()->status);

        // 2. Manager Approve
        $response = $this->actingAs($manager)->post("/contracts/{$contract->id}/approve", ['note' => 'OK']);
        $this->assertEquals(ContractStatus::MENUNGGU_FINANCE, $contract->fresh()->status);

        // 3. Finance Approve
        $response = $this->actingAs($finance)->post("/contracts/{$contract->id}/approve", ['note' => 'OK']);
        $this->assertEquals(ContractStatus::MENUNGGU_DIREKTUR, $contract->fresh()->status);

        // 4. Direktur Approve
        $response = $this->actingAs($direktur)->post("/contracts/{$contract->id}/approve", ['note' => 'OK']);
        $this->assertEquals(ContractStatus::AKTIF, $contract->fresh()->status);
    }

    public function test_wrong_role_cannot_approve()
    {
        $manager = User::factory()->create(['role' => 'MANAGER']);
        $contract = Contract::factory()->create(['status' => ContractStatus::MENUNGGU_FINANCE]);

        $response = $this->actingAs($manager)->post("/contracts/{$contract->id}/approve", ['note' => 'OK']);
        $response->assertForbidden();
    }
}
