<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdditionalValueController extends Controller
{
    /**
     * Get all additional values/metadata
     */
    public function index()
    {
        try {
            // Return system additional values and metadata
            $values = [
                'project_types' => [
                    'renovation', 'repair', 'installation', 'maintenance', 'inspection'
                ],
                'urgency_levels' => [
                    'low', 'medium', 'high', 'urgent'
                ],
                'project_statuses' => [
                    'draft', 'published', 'in_progress', 'completed', 'cancelled'
                ],
                'bid_statuses' => [
                    'pending', 'accepted', 'rejected', 'withdrawn'
                ],
                'payment_methods' => [
                    'stripe', 'paypal', 'bank_transfer', 'cash', 'check'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $values
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve additional values',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
