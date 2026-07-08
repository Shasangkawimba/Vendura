<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\ComplianceRequirement;
use App\Http\Requests\StoreComplianceRequirementRequest;
use App\Http\Requests\UploadComplianceDocumentRequest;
use App\Actions\Compliance\UploadComplianceDocumentAction;
use Illuminate\Http\Request;

class ComplianceRequirementController extends Controller
{
    public function store(StoreComplianceRequirementRequest $request, Vendor $vendor)
    {
        $vendor->complianceRequirements()->create($request->validated());
        return back();
    }

    public function upload(UploadComplianceDocumentRequest $request, ComplianceRequirement $requirement, UploadComplianceDocumentAction $action)
    {
        $action->execute($requirement, $request->file('document'), $request->validated('expiry_date'));
        return back();
    }
}
