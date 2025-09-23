# DAZL API Routes - Complete 1:1 Translation Map

> **CRITICAL**: These routes CANNOT change - they're used by existing React frontend

## Authentication Routes

### Realtor/Agent Routes
```php
// Authentication
POST /api/realtor/register          - RealtorController@register
POST /api/realtor/login            - RealtorController@login
POST /api/realtor/logout           - RealtorController@logout (AUTH)

// Profile Management
PATCH /api/realtor/update          - RealtorController@update (AUTH)
POST /api/realtor/change_password  - RealtorController@change_password (AUTH)
GET /api/realtor                   - RealtorController@getRealtorById

// Project Management
GET /api/filter_project            - RealtorController@filterProject
GET /api/update_project_status/{id} - RealtorController@update_project_status
```

### Professional Routes
```php
// Authentication
POST /api/professional/register     - ProfessionalController@register
POST /api/professional/login       - ProfessionalController@login
POST /api/professional/logout      - ProfessionalController@logout (AUTH)
```

### Customer Routes
```php
// Authentication
POST /api/customer/register        - CustomerController@register
POST /api/customer/login          - CustomerController@login
POST /api/customer/logout         - CustomerController@logout (AUTH)

// Profile Management
POST /api/customer/update/{id}     - CustomerController@update (AUTH)
POST /api/customer/change_password - CustomerController@change_password (AUTH)
```

## Core Business Routes

### Home Diagnostic Reports (PHD) - MAIN FEATURE
```php
GET /api/home-diagnostic-reports/for-realtor                      - HomeDiagnosticReportController@getPHDForRealtor (AUTH)
GET /api/home-diagnostic-reports/for-realtor/{home_diagnostic_reportId} - HomeDiagnosticReportController@getOnePHDForRealtor (AUTH)
POST /api/home-diagnostic-reports                                 - HomeDiagnosticReportController@store (AUTH)
GET /api/home-diagnostic-reports/house-data                      - HomeDiagnosticReportController@getHouseData (AUTH)
```

## Authentication Middleware Notes
- `jwt:realtor` - JWT token for realtors
- `jwt:professional` - JWT token for professionals
- `jwt:customer` - JWT token for customers
- Routes marked (AUTH) require authentication

## Module Structure
Each module has:
- `app/Modules/{ModuleName}/Routes/api.php` - API routes
- `app/Modules/{ModuleName}/Controllers/Api/{Controller}.php` - API controllers
- Namespace: `App\Modules\{ModuleName}\Controllers\Api`

## Modules Found
- Realtor, Professional, Customer (users)
- HomeDiagnosticReport (core PHD feature)
- Project, ProjectOpportunity (marketplace)
- Company, Payment (business logic)
- Room, Feature, FeatureOption (property details)
- ContactUs, Blog (content)

## Next Steps for Laravel 11
1. ✅ Extract routes from ALL remaining modules
2. ✅ Map controller methods 1:1
3. ✅ Preserve exact URL structure
4. ✅ Maintain middleware patterns
5. ✅ Keep JWT authentication system