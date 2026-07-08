<?php

namespace App\Http\Controllers;

use App\Actions\Contracts\ApproveContractAction;
use App\Actions\Contracts\RejectContractAction;
use App\Actions\Contracts\SubmitContractAction;
use App\Http\Requests\ApproveContractRequest;
use App\Http\Requests\RejectContractRequest;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ApprovalController extends Controller
{
    public function submit(Request $request, Contract $contract, SubmitContractAction $action)
    {
        Gate::authorize('view', $contract);
        
        if ($contract->created_by !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $action->execute($contract);

        return back();
    }

    public function approve(ApproveContractRequest $request, Contract $contract, ApproveContractAction $action)
    {
        $action->execute($contract, $request->user(), $request->validated('note'));

        return back();
    }

    public function reject(RejectContractRequest $request, Contract $contract, RejectContractAction $action)
    {
        $action->execute($contract, $request->user(), $request->validated('note'));

        return back();
    }
}
