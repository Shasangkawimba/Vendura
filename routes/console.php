<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\UpdateExpiredContractsJob;
use App\Jobs\SendContractExpiryRemindersJob;

Schedule::job(new UpdateExpiredContractsJob)->daily();
Schedule::job(new SendContractExpiryRemindersJob)->dailyAt('08:00');
