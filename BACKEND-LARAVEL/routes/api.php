<?php

use Illuminate\Support\Facades\Route;

// Import all API controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResetPasswordController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProfessionalController;
use App\Http\Controllers\Api\RealtorController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectOpportunityController;
use App\Http\Controllers\Api\HomeDiagnosticReportController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\FeatureIssueController;
use App\Http\Controllers\Api\FeatureOptionController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomIssueController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProjectTypeController;
use App\Http\Controllers\Api\ServiceTypeController;
use App\Http\Controllers\Api\AdditionalValueController;
use App\Http\Controllers\Api\BaseModuleController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BlogCategoryController;
use App\Http\Controllers\Api\ContactUsController;

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ==========================================

// General Authentication Routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/users/verify/{access_token}', [AuthController::class, 'verifyAccount']);
Route::post('/users/check/{type}', [AuthController::class, 'checkUserExistence']);

// Password Reset Routes
Route::post('/reset-passwords/email', [ResetPasswordController::class, 'sendEmail']);
Route::post('/reset-passwords/check-code', [ResetPasswordController::class, 'checkResetCode']);
Route::patch('/reset-passwords/reset', [ResetPasswordController::class, 'resetPassword']);

// Profile Management (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/profile/', [ProfileController::class, 'getProfile']);
    Route::patch('/profile/update-password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
});

// Customer Authentication & Management
Route::post('/customer/register', [CustomerController::class, 'register']);
Route::post('/customer/login', [CustomerController::class, 'login']);

Route::middleware(['jwt:customer'])->group(function () {
    Route::post('/customer/logout', [CustomerController::class, 'logout']);
    Route::post('/customer/update/{id}', [CustomerController::class, 'update']);
    Route::post('/customer/change_password', [CustomerController::class, 'change_password']);
});

// Professional Authentication & Management
Route::post('/professional/register', [ProfessionalController::class, 'register']);
Route::post('/professional/login', [ProfessionalController::class, 'login']);

Route::middleware(['jwt:professional'])->group(function () {
    Route::post('/professional/logout', [ProfessionalController::class, 'logout']);
});

// Realtor Authentication & Management
Route::post('/realtor/register', [RealtorController::class, 'register']);
Route::post('/realtor/login', [RealtorController::class, 'login']);
Route::get('/realtor', [RealtorController::class, 'getRealtorById']);
Route::get('/filter_project', [RealtorController::class, 'filterProject']);
Route::get('/update_project_status/{id}', [RealtorController::class, 'update_project_status']);

Route::middleware(['jwt:realtor'])->group(function () {
    Route::post('/realtor/logout', [RealtorController::class, 'logout']);
    Route::patch('/realtor/update', [RealtorController::class, 'update']);
    Route::post('/realtor/change_password', [RealtorController::class, 'change_password']);
});

// ==========================================
// 2. PROJECT MANAGEMENT
// ==========================================

// Customer Project Routes
Route::middleware(['jwt:customer'])->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/project/{id}', [ProjectController::class, 'show']);
    Route::get('/projects/customers', [ProjectController::class, 'getProjectsForCustomer']);
    Route::post('/projectImages', [ProjectController::class, 'projectImages']);
    Route::patch('/update-report/{project_id}', [ProjectController::class, 'updatePhpreport']);
    Route::patch('/project/{id}', [ProjectController::class, 'updateProjectStatusAndSendSmsToPros']);
    Route::delete('/project/{id}', [ProjectController::class, 'delete']);
});

// Realtor Project Routes
Route::middleware(['jwt:realtor'])->group(function () {
    Route::get('/customer_list', [ProjectController::class, 'list']);
    Route::get('/realtorprojects', [ProjectController::class, 'index']);
    Route::post('/realtorprojects', [ProjectController::class, 'store']);
    Route::get('/realtorprojects/customers', [ProjectController::class, 'getProjectsForCustomer']);
    Route::post('/realtorprojectsImages', [ProjectController::class, 'projectImages']);
    Route::patch('/realtorprojects/{id}', [ProjectController::class, 'updateProjectStatusAndSendSmsToPros']);
    Route::patch('/statusUpdate/{id}', [ProjectController::class, 'statusUpdate']);
    Route::delete('/realtor/project/{id}', [ProjectController::class, 'delete']);
});

// Public Project Routes
Route::post('/getImage', [ProjectController::class, 'getimage']);

// Project Opportunities for Professionals
Route::middleware(['auth:professional'])->group(function () {
    Route::get('/project-opportunities/professionals/{page}', [ProjectOpportunityController::class, 'getProjectOpportunitiesForPros']);
    Route::patch('/project-opportunities/{id}', [ProjectOpportunityController::class, 'create']);
});

// ==========================================
// 3. HOME DIAGNOSTIC REPORTS (PHD)
// ==========================================

Route::middleware(['jwt:realtor'])->group(function () {
    Route::get('/home-diagnostic-reports/for-realtor', [HomeDiagnosticReportController::class, 'getPHDForRealtor']);
    Route::get('/home-diagnostic-reports/for-realtor/{home_diagnostic_reportId}', [HomeDiagnosticReportController::class, 'getOnePHDForRealtor']);
    Route::post('/home-diagnostic-reports', [HomeDiagnosticReportController::class, 'store']);
    Route::get('/home-diagnostic-reports/house-data', [HomeDiagnosticReportController::class, 'getHouseData']);
});

// ==========================================
// 4. FEATURE & ROOM MANAGEMENT
// ==========================================

// Public Feature Routes
Route::get('/features', [FeatureController::class, 'index']);
Route::get('/room/features', [FeatureController::class, 'getRoomFeatures']);
Route::post('/room/featuresoptions', [FeatureController::class, 'getFeaturesoptions']);

// Feature Issues (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/feature-issues', [FeatureIssueController::class, 'index']);
    Route::get('/getfeatureissue/{id}', [FeatureIssueController::class, 'getfeatureissue']);
});

// Feature Options (Public)
Route::get('/features/feature-options', [FeatureOptionController::class, 'getFeatureOptions']);

// Room Management (Public)
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/gethouse/{address}', [RoomController::class, 'gethouse']);
Route::get('/roomsfeature/{id}', [RoomController::class, 'roomsfeature']);
Route::get('/featureOptionwithissue/{id}', [RoomController::class, 'featureOptionwithissue']);
Route::get('/roomsfeatureissue/{id}', [RoomController::class, 'roomsfeatureissue']);
Route::get('/featureOptions/{id}', [RoomController::class, 'featureOptions']);
Route::get('/featureoptionlist/{id}', [RoomController::class, 'featureoptionlist']);
Route::get('/featureoissueslist/{id}', [RoomController::class, 'featureoissueslist']);
Route::post('/featureOptionswithissue', [RoomController::class, 'featureOptionswithissue']);

// Room Issues (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/room-issues', [RoomIssueController::class, 'index']);
});

// ==========================================
// 5. REFERENCE DATA & LOOKUPS
// ==========================================

// Categories (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
});

// Project Types (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/project-types', [ProjectTypeController::class, 'index']);
});

// Service Types (Public)
Route::middleware(['api'])->group(function () {
    Route::get('/service-types', [ServiceTypeController::class, 'index']);
});

// Additional Values (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/additional-values', [AdditionalValueController::class, 'index']);
});

// Base Modules (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/base-modules', [BaseModuleController::class, 'index']);
});

// ==========================================
// 6. GEOGRAPHIC DATA
// ==========================================

// Countries (Public)
Route::get('/countries', [CountryController::class, 'index']);

// Cities (Public)
Route::get('/cities', [CityController::class, 'index']);

// Houses (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/houses', [HouseController::class, 'index']);
});

// ==========================================
// 7. BUSINESS OPERATIONS
// ==========================================

// Company Management
Route::get('/company-from-professional', [CompanyController::class, 'getCompanyFromPro']);

Route::middleware(['jwt:professional'])->group(function () {
    Route::patch('/company-from-professional/update', [CompanyController::class, 'update']);
});

// Payment Processing (Public)
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/payment/check', [PaymentController::class, 'check']);

// Currencies (Protected)
Route::middleware(['auth:api'])->group(function () {
    Route::get('/currencies', [CurrencyController::class, 'index']);
});

// ==========================================
// 8. CONTENT MANAGEMENT
// ==========================================

// Blog Management (Public)
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'getblogDetail']);
Route::get('/blogstocategory/{id}', [BlogController::class, 'blogstocategory']);
Route::post('/blogstopublish', [BlogController::class, 'publish']);

// Blog Categories (Public)
Route::get('/blog-categories', [BlogCategoryController::class, 'index']);

// ==========================================
// 9. COMMUNICATION
// ==========================================

// Contact Us (Public)
Route::post('/contact-us', [ContactUsController::class, 'store']);

// ==========================================
// TOTAL: 79 API ENDPOINTS
// ==========================================