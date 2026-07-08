<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');

    Route::resource('contracts', App\Http\Controllers\ContractController::class)->only(['index', 'create', 'store', 'show']);
    
    Route::post('/contracts/{contract}/submit', [App\Http\Controllers\ApprovalController::class, 'submit'])->name('contracts.submit');
    Route::post('/contracts/{contract}/approve', [App\Http\Controllers\ApprovalController::class, 'approve'])->name('contracts.approve');
    Route::post('/contracts/{contract}/reject', [App\Http\Controllers\ApprovalController::class, 'reject'])->name('contracts.reject');
    Route::post('/contracts/{contract}/versions', [App\Http\Controllers\ContractVersionController::class, 'store'])->name('contracts.versions.store');

    Route::resource('vendors', App\Http\Controllers\VendorController::class)->only(['index', 'show']);
    Route::post('/vendors/{vendor}/compliance', [App\Http\Controllers\ComplianceRequirementController::class, 'store'])->name('vendors.compliance.store');
    Route::post('/compliance/{requirement}/upload', [App\Http\Controllers\ComplianceRequirementController::class, 'upload'])->name('compliance.upload');
});
