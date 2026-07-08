<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $contractsSummary = Cache::rememberForever('dashboard:contracts:summary', function () {
            return [
                'active' => Contract::where('status', 'AKTIF')->count(),
                'expiring_soon' => Contract::where('status', 'AKTIF')
                    ->whereBetween('end_date', [Carbon::today(), Carbon::today()->addDays(30)])
                    ->count(),
                'draft' => Contract::where('status', 'DRAFT')->count(),
                'pending_approval' => Contract::whereIn('status', ['MENUNGGU_MANAGER', 'MENUNGGU_FINANCE', 'MENUNGGU_DIREKTUR'])->count(),
            ];
        });

        $vendors = Vendor::withCount(['complianceRequirements'])->get();
        $vendorsCompliance = [];

        foreach ($vendors as $vendor) {
            $cacheKey = "dashboard:compliance:{$vendor->id}";
            
            $vendorCompliance = Cache::rememberForever($cacheKey, function () use ($vendor) {
                $fulfilled = $vendor->complianceRequirements()
                    ->where('is_fulfilled', true)
                    ->where(function ($q) {
                        $q->whereNull('expiry_date')->orWhereDate('expiry_date', '>=', Carbon::today());
                    })
                    ->count();

                $rate = $vendor->compliance_requirements_count > 0 
                    ? round(($fulfilled / $vendor->compliance_requirements_count) * 100) 
                    : 100;

                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'rate' => $rate,
                    'total' => $vendor->compliance_requirements_count,
                    'fulfilled' => $fulfilled,
                ];
            });

            $vendorsCompliance[] = $vendorCompliance;
        }

        return Inertia::render('Dashboard/Index', [
            'contractsSummary' => $contractsSummary,
            'vendorsCompliance' => $vendorsCompliance,
        ]);
    }
}
