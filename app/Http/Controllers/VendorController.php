<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        return Inertia::render('Vendors/Index', [
            'vendors' => Vendor::with(['complianceRequirements'])->withCount('contracts')->get(),
        ]);
    }

    public function show(Vendor $vendor)
    {
        $vendor->load(['complianceRequirements']);
        return Inertia::render('Vendors/Show', [
            'vendor' => $vendor,
        ]);
    }
}
