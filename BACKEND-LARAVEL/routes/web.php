<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\RealtorController;
use App\Http\Controllers\ProfessionalController;
use App\Http\Controllers\CustomerController;

// Public Routes
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Authentication Routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

// Protected Routes
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [DashboardController::class, 'profile'])->name('profile.edit');
    Route::patch('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');

    // Realtor Routes
    Route::middleware(['role:realtor'])->prefix('realtor')->name('realtor.')->group(function () {
        Route::get('/phd-reports', [RealtorController::class, 'phdReports'])->name('phd-reports');
        Route::get('/phd-reports/create', [RealtorController::class, 'createPhdReport'])->name('phd-reports.create');
        Route::get('/phd-reports/{id}', [RealtorController::class, 'showPhdReport'])->name('phd-reports.show');
        Route::get('/phd-reports/{id}/edit', [RealtorController::class, 'editPhdReport'])->name('phd-reports.edit');
        Route::post('/phd-reports', [RealtorController::class, 'storePhdReport'])->name('phd-reports.store');
        Route::patch('/phd-reports/{id}', [RealtorController::class, 'updatePhdReport'])->name('phd-reports.update');

        Route::get('/projects', [RealtorController::class, 'projects'])->name('projects');
        Route::get('/projects/{id}', [RealtorController::class, 'showProject'])->name('projects.show');
    });

    // Professional Routes
    Route::middleware(['role:professional'])->prefix('professional')->name('professional.')->group(function () {
        Route::get('/opportunities', [ProfessionalController::class, 'opportunities'])->name('opportunities');
        Route::get('/opportunities/{id}', [ProfessionalController::class, 'showOpportunity'])->name('opportunities.show');
        Route::post('/opportunities/{id}/bid', [ProfessionalController::class, 'submitBid'])->name('opportunities.bid');

        Route::get('/bids', [ProfessionalController::class, 'bids'])->name('bids');
        Route::get('/bids/{id}', [ProfessionalController::class, 'showBid'])->name('bids.show');

        Route::get('/projects', [ProfessionalController::class, 'projects'])->name('projects');
        Route::get('/projects/{id}', [ProfessionalController::class, 'showProject'])->name('projects.show');
    });

    // Customer Routes
    Route::middleware(['role:customer'])->prefix('customer')->name('customer.')->group(function () {
        Route::get('/projects', [CustomerController::class, 'projects'])->name('projects');
        Route::get('/projects/create', [CustomerController::class, 'createProject'])->name('projects.create');
        Route::post('/projects', [CustomerController::class, 'storeProject'])->name('projects.store');
        Route::get('/projects/{id}', [CustomerController::class, 'showProject'])->name('projects.show');
        Route::get('/projects/{id}/edit', [CustomerController::class, 'editProject'])->name('projects.edit');
        Route::patch('/projects/{id}', [CustomerController::class, 'updateProject'])->name('projects.update');
        Route::get('/projects/history', [CustomerController::class, 'projectHistory'])->name('projects.history');

        Route::get('/reports', [CustomerController::class, 'reports'])->name('reports');
        Route::get('/reports/{id}', [CustomerController::class, 'showReport'])->name('reports.show');

        Route::get('/bids/{project_id}', [CustomerController::class, 'projectBids'])->name('bids');
        Route::post('/bids/{bid_id}/accept', [CustomerController::class, 'acceptBid'])->name('bids.accept');
    });

});
