<?php

namespace App\Observers;

use App\Models\ComplianceRequirement;
use Illuminate\Support\Facades\Cache;

class ComplianceRequirementObserver
{
    public function saved(ComplianceRequirement $complianceRequirement): void
    {
        Cache::forget("dashboard:compliance:{$complianceRequirement->vendor_id}");
    }

    public function deleted(ComplianceRequirement $complianceRequirement): void
    {
        Cache::forget("dashboard:compliance:{$complianceRequirement->vendor_id}");
    }
}
