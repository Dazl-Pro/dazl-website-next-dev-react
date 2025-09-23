<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\CompanyResource;
use App\Models\Company;

class CompanyController extends Controller
{
    /**
     * Get all active companies
     */
    public function index(Request $request)
    {
        try {
            $query = Company::with(['portfolioImages', 'professionals']);

            // Filter by service types
            if ($request->has('service_type_ids')) {
                $serviceTypeIds = explode(',', $request->service_type_ids);
                $query->whereHas('serviceTypes', function ($q) use ($serviceTypeIds) {
                    $q->whereIn('service_types.id', $serviceTypeIds);
                });
            }

            // Filter by location
            if ($request->has('city')) {
                $query->where('city', 'like', '%' . $request->city . '%');
            }

            if ($request->has('state')) {
                $query->where('state', $request->state);
            }

            if ($request->has('zip_code')) {
                $query->where('zip_code', $request->zip_code);
            }

            // Filter by rating
            if ($request->has('min_rating')) {
                $query->where('average_rating', '>=', $request->min_rating);
            }

            // Filter by verified status
            if ($request->has('verified')) {
                $query->where('is_verified', $request->boolean('verified'));
            }

            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            $companies = $query->where('is_active', true)
                              ->orderBy('average_rating', 'desc')
                              ->orderBy('name')
                              ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => CompanyResource::collection($companies->items()),
                'pagination' => [
                    'current_page' => $companies->currentPage(),
                    'total_pages' => $companies->lastPage(),
                    'total_items' => $companies->total(),
                    'per_page' => $companies->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get company by ID
     */
    public function show($id)
    {
        try {
            $company = Company::with([
                'portfolioImages',
                'professionals',
                'serviceTypes',
                'projectOpportunities.project'
            ])->find($id);

            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new CompanyResource($company)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve company',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured companies
     */
    public function featured()
    {
        try {
            $featuredCompanies = Company::with(['portfolioImages', 'serviceTypes'])
                                      ->where('is_featured', true)
                                      ->where('is_active', true)
                                      ->orderBy('average_rating', 'desc')
                                      ->limit(8)
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => CompanyResource::collection($featuredCompanies)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get top-rated companies
     */
    public function topRated($limit = 10)
    {
        try {
            $topCompanies = Company::with(['portfolioImages', 'serviceTypes'])
                                 ->where('is_active', true)
                                 ->where('average_rating', '>=', 4.0)
                                 ->orderBy('average_rating', 'desc')
                                 ->orderBy('total_reviews', 'desc')
                                 ->limit($limit)
                                 ->get();

            return response()->json([
                'success' => true,
                'data' => CompanyResource::collection($topCompanies)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve top-rated companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get companies by service type
     */
    public function getByServiceType($serviceTypeId)
    {
        try {
            $companies = Company::with(['portfolioImages', 'serviceTypes'])
                              ->whereHas('serviceTypes', function ($q) use ($serviceTypeId) {
                                  $q->where('service_types.id', $serviceTypeId);
                              })
                              ->where('is_active', true)
                              ->orderBy('average_rating', 'desc')
                              ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => CompanyResource::collection($companies->items()),
                'pagination' => [
                    'current_page' => $companies->currentPage(),
                    'total_pages' => $companies->lastPage(),
                    'total_items' => $companies->total(),
                    'per_page' => $companies->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve companies for service type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get companies near location
     */
    public function near(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:100'
        ]);

        try {
            $radius = $request->radius ?? 25; // Default 25 miles
            $lat = $request->latitude;
            $lng = $request->longitude;

            // Using Haversine formula for distance calculation
            $companies = Company::with(['portfolioImages', 'serviceTypes'])
                              ->selectRaw("
                                  *,
                                  (6371 * acos(cos(radians(?)) * cos(radians(latitude)) *
                                  cos(radians(longitude) - radians(?)) + sin(radians(?)) *
                                  sin(radians(latitude)))) AS distance
                              ", [$lat, $lng, $lat])
                              ->whereNotNull('latitude')
                              ->whereNotNull('longitude')
                              ->where('is_active', true)
                              ->having('distance', '<', $radius)
                              ->orderBy('distance')
                              ->orderBy('average_rating', 'desc')
                              ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => CompanyResource::collection($companies->items()),
                'search_params' => [
                    'latitude' => $lat,
                    'longitude' => $lng,
                    'radius' => $radius
                ],
                'pagination' => [
                    'current_page' => $companies->currentPage(),
                    'total_pages' => $companies->lastPage(),
                    'total_items' => $companies->total(),
                    'per_page' => $companies->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve nearby companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get company statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_companies' => Company::count(),
                'active_companies' => Company::where('is_active', true)->count(),
                'verified_companies' => Company::where('is_verified', true)->count(),
                'featured_companies' => Company::where('is_featured', true)->count(),
                'average_rating' => Company::where('is_active', true)->avg('average_rating'),
                'total_reviews' => Company::sum('total_reviews'),
                'companies_by_state' => Company::selectRaw('state, COUNT(*) as count')
                                             ->where('is_active', true)
                                             ->groupBy('state')
                                             ->orderBy('count', 'desc')
                                             ->limit(10)
                                             ->pluck('count', 'state')
                                             ->toArray(),
                'rating_distribution' => Company::selectRaw('
                    CASE
                        WHEN average_rating >= 4.5 THEN "5_stars"
                        WHEN average_rating >= 3.5 THEN "4_stars"
                        WHEN average_rating >= 2.5 THEN "3_stars"
                        WHEN average_rating >= 1.5 THEN "2_stars"
                        ELSE "1_star"
                    END as rating_group,
                    COUNT(*) as count
                ')
                ->where('is_active', true)
                ->groupBy('rating_group')
                ->pluck('count', 'rating_group')
                ->toArray()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve company statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
