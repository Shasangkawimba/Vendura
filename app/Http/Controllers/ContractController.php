<?php

namespace App\Http\Controllers;

use App\Enums\ContractStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreContractRequest;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Contract::with(['vendor', 'creator']);

        // Only enforce viewing restrictions if they aren't authorized to view all
        // (Handled partially by Policy, but this filters the list view)
        if (!in_array($user->role, [UserRole::ADMIN, UserRole::MANAGER, UserRole::FINANCE, UserRole::DIREKTUR])) {
            $query->where('created_by', $user->id);
        }

        $contracts = $query->latest()->get();

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
        ]);
    }

    public function create(Request $request)
    {
        Gate::authorize('create', Contract::class);

        $vendors = Vendor::orderBy('name')->get();

        return Inertia::render('Contracts/Create', [
            'vendors' => $vendors,
        ]);
    }

    public function store(StoreContractRequest $request)
    {
        $validated = $request->validated();

        $contract = Contract::create([
            'vendor_id' => $validated['vendor_id'],
            'title' => $validated['title'],
            'value' => $validated['value'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => ContractStatus::DRAFT,
            'created_by' => $request->user()->id,
        ]);

        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('contracts', 'public');
            
            ContractVersion::create([
                'contract_id' => $contract->id,
                'file_path' => $path,
                'version_number' => 1,
                'uploaded_by' => $request->user()->id,
            ]);
        }

        return redirect()->route('contracts.index');
    }

    public function show(Request $request, Contract $contract)
    {
        Gate::authorize('view', $contract);

        $contract->load(['vendor', 'creator', 'versions.uploader', 'approvalHistories.approver']);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
        ]);
    }
}
