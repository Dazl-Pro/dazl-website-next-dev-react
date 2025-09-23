<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RealtorController;
use App\Http\Controllers\Api\ProfessionalController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HomeDiagnosticReportController;

// Realtor/Agent Routes
Route::group(['prefix' => 'realtor'], function () {
    Route::post('/register', [RealtorController::class, 'register']);
    Route::post('/login', [RealtorController::class, 'login']);

    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('/logout', [RealtorController::class, 'logout']);
        Route::patch('/update', [RealtorController::class, 'update']);
        Route::post('/change_password', [RealtorController::class, 'change_password']);
    });
});

Route::get('/realtor', [RealtorController::class, 'getRealtorById']);
Route::get('/filter_project', [RealtorController::class, 'filterProject']);
Route::get('/update_project_status/{id}', [RealtorController::class, 'update_project_status']);

// Professional Routes
Route::group(['prefix' => 'professional'], function () {
    Route::post('/register', [ProfessionalController::class, 'register']);
    Route::post('/login', [ProfessionalController::class, 'login']);

    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('/logout', [ProfessionalController::class, 'logout']);
    });
});

// Customer Routes
Route::group(['prefix' => 'customer'], function () {
    Route::post('/register', [CustomerController::class, 'register']);
    Route::post('/login', [CustomerController::class, 'login']);

    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('/logout', [CustomerController::class, 'logout']);
        Route::post('/update/{id}', [CustomerController::class, 'update']);
        Route::post('/change_password', [CustomerController::class, 'change_password']);
    });
});

// Home Diagnostic Reports (PHD) - MAIN FEATURE
Route::group(['prefix' => 'home-diagnostic-reports', 'middleware' => 'auth:api'], function () {
    Route::get('/for-realtor', [HomeDiagnosticReportController::class, 'getPHDForRealtor']);
    Route::get('/for-realtor/{home_diagnostic_reportId}', [HomeDiagnosticReportController::class, 'getOnePHDForRealtor']);
    Route::post('/', [HomeDiagnosticReportController::class, 'store']);
    Route::get('/house-data', [HomeDiagnosticReportController::class, 'getHouseData']);
});
