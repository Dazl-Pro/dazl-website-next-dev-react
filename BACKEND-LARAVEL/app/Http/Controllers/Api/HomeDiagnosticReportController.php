<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeDiagnosticReportController extends Controller
{
    public function getPHDForRealtor(Request $request)
    {
        return response()->json([
            'message' => 'PHD reports for realtor retrieved',
            'reports' => []
        ]);
    }

    public function getOnePHDForRealtor(Request $request, $home_diagnostic_reportId)
    {
        return response()->json([
            'message' => 'Single PHD report retrieved',
            'report' => []
        ]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'PHD report created successfully',
            'report' => []
        ], 201);
    }

    public function getHouseData(Request $request)
    {
        return response()->json([
            'message' => 'House data retrieved',
            'data' => []
        ]);
    }
}
