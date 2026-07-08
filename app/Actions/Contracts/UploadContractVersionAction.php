<?php

namespace App\Actions\Contracts;

use App\Models\Contract;
use App\Models\ContractVersion;
use Illuminate\Http\UploadedFile;

class UploadContractVersionAction
{
    public function execute(Contract $contract, UploadedFile $file, int $uploaderId): ContractVersion
    {
        $latestVersion = $contract->versions()->max('version_number') ?? 0;
        $nextVersion = $latestVersion + 1;

        $path = $file->store('contracts', 'public');

        return $contract->versions()->create([
            'file_path' => $path,
            'version_number' => $nextVersion,
            'uploaded_by' => $uploaderId,
        ]);
    }
}
