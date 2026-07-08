<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplianceRequirement extends Model
{
    protected $fillable = [
        'vendor_id',
        'document_name',
        'is_fulfilled',
        'file_path',
        'expiry_date',
    ];

    protected $casts = [
        'is_fulfilled' => 'boolean',
        'expiry_date' => 'date',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
