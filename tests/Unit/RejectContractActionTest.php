<?php

namespace Tests\Unit;

use App\Actions\Contracts\RejectContractAction;
use App\Enums\ContractStatus;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RejectContractActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_finance_can_reject_contract()
    {
        $finance = User::factory()->create(['role' => 'FINANCE']);
        $contract = Contract::factory()->create(['status' => ContractStatus::MENUNGGU_FINANCE]);

        $action = app(RejectContractAction::class);
        $action->execute($contract, $finance, 'Missing documents');

        $this->assertEquals(ContractStatus::DRAFT, $contract->fresh()->status);
        $this->assertDatabaseHas('approval_histories', [
            'contract_id' => $contract->id,
            'approver_id' => $finance->id,
            'stage' => 'FINANCE',
            'decision' => 'REJECTED',
            'note' => 'Missing documents',
        ]);
    }
}
