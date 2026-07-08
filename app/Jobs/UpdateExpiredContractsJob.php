<?php

namespace App\Jobs;

use App\Models\Contract;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateExpiredContractsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Find all active contracts where end_date is strictly before today
        Contract::where('status', 'AKTIF')
            ->whereDate('end_date', '<', Carbon::today())
            ->update(['status' => 'EXPIRED']);
    }
}
