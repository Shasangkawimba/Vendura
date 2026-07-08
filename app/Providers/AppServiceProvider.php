<?php

namespace App\Providers;

use App\Models\Contract;
use App\Models\ComplianceRequirement;
use App\Observers\ContractObserver;
use App\Observers\ComplianceRequirementObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Contract::observe(ContractObserver::class);
        ComplianceRequirement::observe(ComplianceRequirementObserver::class);
    }
}
