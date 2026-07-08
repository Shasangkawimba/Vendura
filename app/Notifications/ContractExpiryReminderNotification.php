<?php

namespace App\Notifications;

use App\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractExpiryReminderNotification extends Notification
{
    use Queueable;

    public function __construct(public Contract $contract, public int $daysLeft)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject("Reminder: Contract '{$this->contract->title}' is expiring in {$this->daysLeft} days")
                    ->line("The contract with {$this->contract->vendor->name} is set to expire on {$this->contract->end_date}.")
                    ->action('View Contract', url("/contracts/{$this->contract->id}"))
                    ->line('Please take necessary actions for renewal or termination.');
    }
}
