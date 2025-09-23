<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\HomeDiagnosticReportRequest;
use App\Http\Resources\HomeDiagnosticReportResource;
use App\Services\HomeDiagnosticReportService;
use App\Models\HomeDiagnosticReport;

class HomeDiagnosticReportController extends Controller
{
    protected HomeDiagnosticReportService $reportService;

    public function __construct(HomeDiagnosticReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Store Home Diagnostic Report (PHD)
     */
    public function store(HomeDiagnosticReportRequest $request)
    {
        try {
            $result = $this->reportService->createReport(
                $request->validated(),
                auth()->id()
            );

            $responseData = [
                'report' => new HomeDiagnosticReportResource($result['report']),
                'project' => $result['project'] ? new \App\Http\Resources\ProjectResource($result['project']) : null,
                'customer' => $result['customer'] ? new \App\Http\Resources\CustomerResource($result['customer']) : null,
            ];

            // Format response for legacy API compatibility
            if (!$request->has('project_id')) {
                $responseData = [
                    'project_id' => $result['project']?->id,
                    'house_id' => $result['report']->id,
                    'customer' => $result['customer'] ? [
                        'first_name' => $result['customer']->first_name,
                        'last_name' => $result['customer']->last_name,
                        'email' => $result['customer']->email
                    ] : null
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Home diagnostic report created successfully',
                'data' => $responseData
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create home diagnostic report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get house data from external API or database
     */
    public function getHouseData(Request $request)
    {
        $request->validate([
            'address' => 'required|string',
        ]);

        try {
            $houseData = $this->reportService->getHouseData($request->address);

            return response()->json([
                'success' => true,
                'data' => $houseData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve house data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get PHD reports for authenticated realtor
     */
    public function getPHDForRealtor()
    {
        try {
            $reports = $this->reportService->getReportsForRealtor(auth()->id());

            return response()->json([
                'success' => true,
                'reports' => HomeDiagnosticReportResource::collection($reports)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PHD reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single PHD report for realtor
     */
    public function getOnePHDForRealtor($homeDiagnosticReportId)
    {
        try {
            $report = $this->reportService->getReportForRealtor($homeDiagnosticReportId, auth()->id());

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'reports' => new HomeDiagnosticReportResource($report)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PHD report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update PHD report
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'client_email' => 'sometimes|email|max:255',
            'street_no' => 'sometimes|string|max:10',
            'street_name' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'zip_code' => 'sometimes|string|max:10',
            'highest_price' => 'sometimes|numeric',
            'lowest_price' => 'sometimes|numeric',
            'year_built' => 'sometimes|integer',
            'bathrooms' => 'sometimes|integer',
            'bedrooms' => 'sometimes|integer',
            'basement' => 'sometimes|string|max:255',
            'gross_size' => 'sometimes|string|max:255',
            'spaces' => 'sometimes|string|max:255',
            'parking_features' => 'sometimes|string|max:255',
            'property_stories' => 'sometimes|string|max:255',
            'structure_type' => 'sometimes|string|max:255',
            'lot_size' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'foundation_type' => 'sometimes|string|max:255',
            'tax_accessed_value' => 'sometimes|numeric',
            'annual_tax_amount' => 'sometimes|numeric',
            'sale_date' => 'sometimes|date',
            'sale_amount' => 'sometimes|numeric',
            'type' => 'sometimes|string|max:255',
            'phd_description' => 'sometimes|string|max:1000',
        ]);

        try {
            $report = $this->reportService->updateReport($id, $request->only([
                'first_name', 'last_name', 'client_email', 'street_no', 'street_name',
                'city', 'state', 'zip_code', 'highest_price', 'lowest_price',
                'year_built', 'bathrooms', 'bedrooms', 'basement', 'gross_size',
                'spaces', 'parking_features', 'property_stories', 'structure_type',
                'lot_size', 'location', 'foundation_type', 'tax_accessed_value',
                'annual_tax_amount', 'sale_date', 'sale_amount', 'type', 'phd_description'
            ]));

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'PHD report updated successfully',
                'data' => new HomeDiagnosticReportResource($report)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update PHD report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete PHD report
     */
    public function delete($id)
    {
        try {
            $deleted = $this->reportService->deleteReport($id);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'PHD report deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete PHD report',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
