<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Get all currencies
     */
    public function index()
    {
        try {
            // For now, return common currencies - in production this could be from database
            $currencies = [
                ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
                ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€'],
                ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£'],
                ['code' => 'CAD', 'name' => 'Canadian Dollar', 'symbol' => 'C$'],
                ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$'],
            ];

            return response()->json([
                'success' => true,
                'data' => $currencies
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve currencies',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
