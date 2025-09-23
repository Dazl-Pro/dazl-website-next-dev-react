<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\ProjectOpportunity;

class PaymentController extends Controller
{
    /**
     * Get payments for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $userId = auth()->id();
            $userType = auth()->user() instanceof \App\Models\Customer ? 'customer' : 'professional';

            $query = Payment::with(['projectOpportunity', 'projectOpportunity.project']);

            if ($userType === 'customer') {
                $query->whereHas('projectOpportunity.project', function ($q) use ($userId) {
                    $q->where('customer_id', $userId);
                });
            } else {
                $query->whereHas('projectOpportunity', function ($q) use ($userId) {
                    $q->where('professional_id', $userId);
                });
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('from_date')) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }

            if ($request->has('to_date')) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }

            $payments = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'data' => PaymentResource::collection($payments->items()),
                'pagination' => [
                    'current_page' => $payments->currentPage(),
                    'total_pages' => $payments->lastPage(),
                    'total_items' => $payments->total(),
                    'per_page' => $payments->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process payment for accepted project opportunity
     */
    public function processPayment(Request $request, $opportunityId)
    {
        $request->validate([
            'payment_method' => 'required|string|in:stripe,paypal,bank_transfer',
            'payment_token' => 'required_if:payment_method,stripe,paypal|string',
            'bank_details' => 'required_if:payment_method,bank_transfer|array',
        ]);

        try {
            $userId = auth()->id();
            $opportunity = ProjectOpportunity::with(['project'])
                                           ->whereHas('project', function ($q) use ($userId) {
                                               $q->where('customer_id', $userId);
                                           })
                                           ->where('id', $opportunityId)
                                           ->where('status', 'accepted')
                                           ->first();

            if (!$opportunity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Opportunity not found or not eligible for payment'
                ], 404);
            }

            // Check if payment already exists
            $existingPayment = Payment::where('project_opportunity_id', $opportunityId)->first();
            if ($existingPayment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment already processed for this opportunity'
                ], 400);
            }

            // Create payment record
            $payment = Payment::create([
                'project_opportunity_id' => $opportunityId,
                'amount' => $opportunity->bid_amount,
                'currency' => 'USD', // Default currency
                'payment_method' => $request->payment_method,
                'status' => 'pending',
                'payment_intent_id' => $request->payment_token ?? null,
                'metadata' => json_encode($request->bank_details ?? [])
            ]);

            // TODO: Integrate with actual payment processor
            switch ($request->payment_method) {
                case 'stripe':
                    $this->processStripePayment($payment, $request->payment_token);
                    break;
                case 'paypal':
                    $this->processPaypalPayment($payment, $request->payment_token);
                    break;
                case 'bank_transfer':
                    $this->processBankTransfer($payment, $request->bank_details);
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'data' => new PaymentResource($payment->fresh())
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment details
     */
    public function show($id)
    {
        try {
            $userId = auth()->id();
            $userType = auth()->user() instanceof \App\Models\Customer ? 'customer' : 'professional';

            $query = Payment::with(['projectOpportunity', 'projectOpportunity.project']);

            if ($userType === 'customer') {
                $query->whereHas('projectOpportunity.project', function ($q) use ($userId) {
                    $q->where('customer_id', $userId);
                });
            } else {
                $query->whereHas('projectOpportunity', function ($q) use ($userId) {
                    $q->where('professional_id', $userId);
                });
            }

            $payment = $query->where('id', $id)->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process refund (Customer only)
     */
    public function refund(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        try {
            $userId = auth()->id();
            $payment = Payment::whereHas('projectOpportunity.project', function ($q) use ($userId) {
                                $q->where('customer_id', $userId);
                            })
                            ->where('id', $id)
                            ->where('status', 'completed')
                            ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found or not eligible for refund'
                ], 404);
            }

            // Update payment status to refund requested
            $payment->update([
                'status' => 'refund_requested',
                'refund_reason' => $request->reason,
                'refund_requested_at' => now()
            ]);

            // TODO: Process actual refund through payment processor

            return response()->json([
                'success' => true,
                'message' => 'Refund request submitted successfully',
                'data' => new PaymentResource($payment->fresh())
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process refund',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function statistics()
    {
        try {
            $userId = auth()->id();
            $userType = auth()->user() instanceof \App\Models\Customer ? 'customer' : 'professional';

            $query = Payment::query();

            if ($userType === 'customer') {
                $query->whereHas('projectOpportunity.project', function ($q) use ($userId) {
                    $q->where('customer_id', $userId);
                });
            } else {
                $query->whereHas('projectOpportunity', function ($q) use ($userId) {
                    $q->where('professional_id', $userId);
                });
            }

            $stats = [
                'total_paid' => $query->where('status', 'completed')->sum('amount'),
                'pending_payments' => $query->where('status', 'pending')->sum('amount'),
                'total_transactions' => $query->count(),
                'completed_transactions' => $query->where('status', 'completed')->count(),
                'monthly_breakdown' => $query->where('status', 'completed')
                                           ->whereYear('created_at', now()->year)
                                           ->selectRaw('MONTH(created_at) as month, SUM(amount) as total')
                                           ->groupBy('month')
                                           ->pluck('total', 'month')
                                           ->toArray()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process Stripe payment (placeholder)
     */
    private function processStripePayment(Payment $payment, string $paymentToken): void
    {
        // TODO: Implement Stripe payment processing
        $payment->update([
            'status' => 'completed',
            'processed_at' => now(),
            'transaction_id' => 'stripe_' . uniqid()
        ]);
    }

    /**
     * Process PayPal payment (placeholder)
     */
    private function processPaypalPayment(Payment $payment, string $paymentToken): void
    {
        // TODO: Implement PayPal payment processing
        $payment->update([
            'status' => 'completed',
            'processed_at' => now(),
            'transaction_id' => 'paypal_' . uniqid()
        ]);
    }

    /**
     * Process bank transfer (placeholder)
     */
    private function processBankTransfer(Payment $payment, array $bankDetails): void
    {
        // TODO: Implement bank transfer processing
        $payment->update([
            'status' => 'pending_verification',
            'metadata' => json_encode($bankDetails)
        ]);
    }
}
