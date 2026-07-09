<?php

namespace App\Actions\Contracts;

use App\Enums\ApprovalStage;
use App\Enums\ContractStatus;
use App\Models\ApprovalHistory;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveContractAction
{
    public function execute(Contract $contract, User $user, ?string $note = null): void
    {
        DB::transaction(function () use ($contract, $user, $note) {
            $stage = match ($contract->status->value) {
                'MENUNGGU_MANAGER' => ApprovalStage::MANAGER,
                'MENUNGGU_FINANCE' => ApprovalStage::FINANCE,
                'MENUNGGU_DIREKTUR' => ApprovalStage::DIREKTUR,
                default => throw ValidationException::withMessages(['contract' => 'Contract is not pending approval.']),
            };

            if ($user->role->value !== $stage->value) {
                throw ValidationException::withMessages(['role' => 'Unauthorized role for this approval stage.']);
            }

            ApprovalHistory::create([
                'contract_id' => $contract->id,
                'approver_id' => $user->id,
                'stage' => $stage->value,
                'decision' => 'APPROVED',
                'note' => $note,
            ]);

            $nextStatus = match ($contract->status->value) {
                'MENUNGGU_MANAGER' => ContractStatus::MENUNGGU_FINANCE,
                'MENUNGGU_FINANCE' => ContractStatus::MENUNGGU_DIREKTUR,
                'MENUNGGU_DIREKTUR' => ContractStatus::AKTIF,
                default => $contract->status,
            };

            $contract->update(['status' => $nextStatus]);
        });
    }
}
