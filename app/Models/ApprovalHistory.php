<?php

namespace App\Models;

use App\Enums\ApprovalStage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalHistory extends Model
{
    use HasFactory;

    public $timestamps = false; // Only created_at is used

    protected $fillable = [
        'contract_id',
        'approver_id',
        'stage',
        'decision',
        'note',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'stage' => ApprovalStage::class,
            'created_at' => 'datetime',
        ];
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
