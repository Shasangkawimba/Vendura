<?php

namespace App\Actions\Compliance;

use App\Models\ComplianceRequirement;
use Illuminate\Http\UploadedFile;

class UploadComplianceDocumentAction
{
    public function execute(ComplianceRequirement $requirement, UploadedFile $file, string $expiryDate): ComplianceRequirement
    {
        $path = $file->store('compliance', 'public');

        $requirement->update([
            'file_path' => $path,
            'is_fulfilled' => true,
            'expiry_date' => $expiryDate,
        ]);

        return $requirement;
    }
}
