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
            $activeThisMonth = Contract::where('status', 'AKTIF')->whereMonth('start_date', Carbon::now()->month)->whereYear('start_date', Carbon::now()->year)->count();
            $activeLastMonth = Contract::where('status', 'AKTIF')->whereMonth('start_date', Carbon::now()->subMonth()->month)->whereYear('start_date', Carbon::now()->subMonth()->year)->count();
            $activePercentChange = $activeLastMonth > 0 ? round((($activeThisMonth - $activeLastMonth) / $activeLastMonth) * 100) : ($activeThisMonth > 0 ? 100 : 0);

            $pendingContracts = Contract::whereIn('status', ['MENUNGGU_MANAGER', 'MENUNGGU_FINANCE', 'MENUNGGU_DIREKTUR'])->get();
            $avgQueueDays = $pendingContracts->count() > 0 ? round($pendingContracts->avg(function ($c) {
                return max(0, $c->updated_at->diffInDays(Carbon::now()));
            }), 1) : 0;

            return [
                'active' => Contract::where('status', 'AKTIF')->count(),
                'active_percent_change' => $activePercentChange,
                'total_value' => Contract::where('status', 'AKTIF')->sum('value'),
                'expiring_soon' => Contract::where('status', 'AKTIF')
                    ->whereBetween('end_date', [Carbon::today(), Carbon::today()->addDays(30)])
                    ->count(),
                'critical_renewals' => Contract::where('status', 'AKTIF')
                    ->whereBetween('end_date', [Carbon::today(), Carbon::today()->addDays(7)])
                    ->count(),
                'draft' => Contract::where('status', 'DRAFT')->count(),
                'pending_approval' => $pendingContracts->count(),
                'avg_queue_days' => $avgQueueDays,
            ];
        });

        $monthlyValues = Cache::rememberForever('dashboard:monthly_values', function () {
            $months = collect(range(5, 0))->map(function ($i) {
                return Carbon::today()->startOfMonth()->subMonths($i);
            });

            $data = [];
            $maxValue = 0;
            
            foreach ($months as $month) {
                $sum = Contract::whereYear('start_date', $month->year)
                    ->whereMonth('start_date', $month->month)
                    ->sum('value');
                $maxValue = max($maxValue, $sum);
                
                $data[] = [
                    'month' => $month->format('M'),
                    'value' => round($sum / 1000000, 1),
                    'raw_value' => $sum
                ];
            }
            
            $maxValInMillions = max(0.1, round($maxValue / 1000000, 1));
            
            return collect($data)->map(function ($item) use ($maxValInMillions) {
                $item['percent'] = min(100, round(($item['value'] / $maxValInMillions) * 100));
                return $item;
            })->toArray();
        });

        $recentActivity = \App\Models\ApprovalHistory::with(['contract', 'approver'])
            ->latest('created_at')
            ->take(4)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'type' => 'approval',
                    'contract_title' => $history->contract->title ?? 'Contract',
                    'user_name' => $history->approver->name ?? 'User',
                    'action' => strtolower($history->decision), // approved, rejected
                    'stage' => $history->stage->value,
                    'created_at' => $history->created_at->diffForHumans(),
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
            'monthlyValues' => $monthlyValues,
            'recentActivity' => $recentActivity,
        ]);
    }
}
