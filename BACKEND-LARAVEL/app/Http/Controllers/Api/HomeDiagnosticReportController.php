<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\HomeDiagnosticReport;
use App\Models\Project;

class HomeDiagnosticReportController extends Controller
{
    /**
     * Store Home Diagnostic Report (PHD)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'client_email' => 'required|email',
            'street_no' => 'required|string|max:50',
            'street_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'highest_price' => 'required|numeric',
            'lowest_price' => 'required|numeric',
            'year_built' => 'required|integer',
            'bathrooms' => 'required|integer',
            'bedrooms' => 'required|integer',
            'basement' => 'required|string',
            'gross_size' => 'required|string',
            'spaces' => 'required|string',
            'parking_features' => 'required|string',
            'property_stories' => 'required|string',
            'structure_type' => 'required|string',
            'lot_size' => 'required|string',
            'location' => 'required|string',
            'foundation_type' => 'required|string',
            'tax_accessed_value' => 'required|numeric',
            'annual_tax_amount' => 'required|numeric',
            'sale_date' => 'required|date',
            'sale_amount' => 'required|numeric',
            'type' => 'required|string',
            'phd_description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $homeDiagnosticReport = HomeDiagnosticReport::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'client_email' => $request->client_email,
                'street_no' => $request->street_no,
                'street_name' => $request->street_name,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zip_code,
                'highest_price' => $request->highest_price,
                'lowest_price' => $request->lowest_price,
                'year_built' => $request->year_built,
                'bathrooms' => $request->bathrooms,
                'bedrooms' => $request->bedrooms,
                'basement' => $request->basement,
                'gross_size' => $request->gross_size,
                'spaces' => $request->spaces,
                'parking_features' => $request->parking_features,
                'property_stories' => $request->property_stories,
                'structure_type' => $request->structure_type,
                'lot_size' => $request->lot_size,
                'location' => $request->location,
                'foundation_type' => $request->foundation_type,
                'tax_accessed_value' => $request->tax_accessed_value,
                'annual_tax_amount' => $request->annual_tax_amount,
                'sale_date' => $request->sale_date,
                'sale_amount' => $request->sale_amount,
                'type' => $request->type,
                'phd_description' => $request->phd_description,
                'realtor_id' => auth()->id(),
            ]);

            // Create associated project if not exists
            if (!$request->has('project_id')) {
                $project = Project::create([
                    'title' => 'PHD Report Project',
                    'description' => $request->phd_description,
                    'location' => $request->location,
                    'home_diagnostic_report_id' => $homeDiagnosticReport->id,
                    'realtor_id' => auth()->id(),
                    'status' => 'draft'
                ]);

                $responseData = [
                    'project_id' => $project->id,
                    'house_id' => $homeDiagnosticReport->id,
                    'customer' => [
                        'first_name' => $request->first_name,
                        'last_name' => $request->last_name,
                        'email' => $request->client_email
                    ]
                ];
            } else {
                $responseData = $homeDiagnosticReport;
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
        $validator = Validator::make($request->all(), [
            'address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // TODO: Implement actual external API call for house data
            // For now, returning mock data structure based on the old implementation

            // Simulate external API response
            $mockHouseData = [
                'type' => 'Single Family',
                'year_built' => 1995,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'structure_type' => 'Frame',
                'lot_size' => '0.25 acres',
                'location' => $request->address,
                'foundation_type' => 'Concrete',
                'tax_accessed_value' => 250000,
                'sale_date' => '2020-01-15',
            ];

            return response()->json([
                'success' => true,
                'data' => $mockHouseData
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
            $realtorId = auth()->id();
            $reports = HomeDiagnosticReport::with(['projects'])
                                          ->where('realtor_id', $realtorId)
                                          ->get();

            return response()->json([
                'success' => true,
                'reports' => $reports
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
            $realtorId = auth()->id();
            $report = HomeDiagnosticReport::with(['projects'])
                                         ->where('id', $homeDiagnosticReportId)
                                         ->where('realtor_id', $realtorId)
                                         ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'reports' => $report
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
        try {
            $report = HomeDiagnosticReport::find($id);
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            $report->update($request->only([
                'first_name', 'last_name', 'client_email', 'street_no', 'street_name',
                'city', 'state', 'zip_code', 'highest_price', 'lowest_price',
                'year_built', 'bathrooms', 'bedrooms', 'basement', 'gross_size',
                'spaces', 'parking_features', 'property_stories', 'structure_type',
                'lot_size', 'location', 'foundation_type', 'tax_accessed_value',
                'annual_tax_amount', 'sale_date', 'sale_amount', 'type', 'phd_description'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'PHD report updated successfully',
                'data' => $report
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
            $report = HomeDiagnosticReport::find($id);
            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'PHD report not found'
                ], 404);
            }

            $report->delete();

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
