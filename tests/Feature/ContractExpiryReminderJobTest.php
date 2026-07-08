<?php

namespace Tests\Feature;

use App\Enums\ContractStatus;
use App\Jobs\SendContractExpiryRemindersJob;
use App\Models\Contract;
use App\Models\User;
use App\Notifications\ContractExpiryReminderNotification;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ContractExpiryReminderJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_reminder_job_does_not_send_duplicate_emails()
    {
        Notification::fake();

        $creator = User::factory()->create();
        $contract = Contract::factory()->create([
            'created_by' => $creator->id,
            'status' => ContractStatus::AKTIF,
            'end_date' => Carbon::today()->addDays(30)
        ]);

        $job = new SendContractExpiryRemindersJob();
        
        // Run first time
        $job->handle();
        Notification::assertSentTo($creator, ContractExpiryReminderNotification::class, 1);

        // Run second time (should not send again)
        $job->handle();
        Notification::assertSentTo($creator, ContractExpiryReminderNotification::class, 1);
    }
}
