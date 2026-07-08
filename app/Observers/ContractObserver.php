<?php

namespace App\Observers;

use App\Models\Contract;
use Illuminate\Support\Facades\Cache;

class ContractObserver
{
    public function saved(Contract $contract): void
    {
        Cache::forget('dashboard:contracts:summary');
    }

    public function deleted(Contract $contract): void
    {
        Cache::forget('dashboard:contracts:summary');
    }
}
