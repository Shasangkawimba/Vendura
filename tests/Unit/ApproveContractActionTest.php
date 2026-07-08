<?php

namespace Tests\Unit;

use App\Actions\Contracts\ApproveContractAction;
use App\Enums\ContractStatus;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ApproveContractActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_approve_waiting_manager_contract()
    {
        $manager = User::factory()->create(['role' => 'MANAGER']);
        $contract = Contract::factory()->create(['status' => ContractStatus::MENUNGGU_MANAGER]);

        $action = app(ApproveContractAction::class);
        $action->execute($contract, $manager, 'Looks good');

        $this->assertEquals(ContractStatus::MENUNGGU_FINANCE, $contract->fresh()->status);
        $this->assertDatabaseHas('approval_histories', [
            'contract_id' => $contract->id,
            'approver_id' => $manager->id,
            'stage' => 'MANAGER',
            'decision' => 'APPROVED',
        ]);
    }

    public function test_finance_cannot_approve_when_waiting_manager()
    {
        $finance = User::factory()->create(['role' => 'FINANCE']);
        $contract = Contract::factory()->create(['status' => ContractStatus::MENUNGGU_MANAGER]);

        $action = app(ApproveContractAction::class);

        $this->expectException(ValidationException::class);
        $action->execute($contract, $finance, 'Should fail');
    }
}
