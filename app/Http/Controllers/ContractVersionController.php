<?php

namespace App\Http\Controllers;

use App\Actions\Contracts\UploadContractVersionAction;
use App\Http\Requests\UploadContractVersionRequest;
use App\Models\Contract;

class ContractVersionController extends Controller
{
    public function store(UploadContractVersionRequest $request, Contract $contract, UploadContractVersionAction $action)
    {
        $action->execute($contract, $request->file('document'), $request->user()->id);

        return back();
    }
}
