<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard/Index');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
});

Route::get('/contracts', function () {
    return Inertia::render('Contracts/Index');
});

Route::get('/compliance', function () {
    return Inertia::render('Compliance/Index');
});
