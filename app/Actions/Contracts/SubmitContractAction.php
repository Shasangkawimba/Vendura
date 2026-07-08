<?php

namespace App\Actions\Contracts;

use App\Enums\ContractStatus;
use App\Models\Contract;
use Illuminate\Validation\ValidationException;

class SubmitContractAction
{
    public function execute(Contract $contract): void
    {
        if ($contract->status !== ContractStatus::DRAFT) {
            throw ValidationException::withMessages([
                'contract' => 'Only DRAFT contracts can be submitted.',
            ]);
        }

        $contract->update([
            'status' => ContractStatus::MENUNGGU_MANAGER,
        ]);
    }
}
