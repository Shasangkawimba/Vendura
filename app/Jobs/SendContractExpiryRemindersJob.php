<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Notifications\ContractExpiryReminderNotification;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class SendContractExpiryRemindersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $thresholds = [30, 7, 1];
        
        foreach ($thresholds as $days) {
            $targetDate = Carbon::today()->addDays($days);
            
            $contracts = Contract::with(['vendor', 'creator'])
                ->where('status', 'AKTIF')
                ->whereDate('end_date', $targetDate)
                ->get();
                
            foreach ($contracts as $contract) {
                // Redis key for idempotency
                $cacheKey = "reminder:contract:{$contract->id}:days:{$days}";
                
                if (!Cache::has($cacheKey)) {
                    if ($contract->creator) {
                        $contract->creator->notify(new ContractExpiryReminderNotification($contract, $days));
                    }
                    
                    // Mark as sent in Redis cache (expires after 40 days to clean up space)
                    Cache::put($cacheKey, true, now()->addDays(40));
                }
            }
        }
    }
}
