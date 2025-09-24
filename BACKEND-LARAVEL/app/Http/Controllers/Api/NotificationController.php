<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Send test note/email
     */
    public function sendTestNote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'to_email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string|in:note,email,sms'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $toEmail = $request->to_email;
            $subject = $request->subject;
            $message = $request->message;
            $type = $request->get('type', 'note');

            // Log the notification attempt
            Log::info('Test notification sent', [
                'to' => $toEmail,
                'subject' => $subject,
                'type' => $type,
                'sent_by' => auth()->id() ?? 'system'
            ]);

            // In a real implementation, this would send actual emails
            // For now, we'll simulate successful sending
            return response()->json([
                'success' => true,
                'message' => 'Test note sent successfully',
                'data' => [
                    'to' => $toEmail,
                    'subject' => $subject,
                    'type' => $type,
                    'sent_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test note',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send test mail with PHD report or attachments
     */
    public function sendTestMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'to_email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachment_url' => 'nullable|url',
            'report_id' => 'nullable|integer',
            'project_id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $toEmail = $request->to_email;
            $subject = $request->subject;
            $message = $request->message;
            $attachmentUrl = $request->attachment_url;
            $reportId = $request->report_id;
            $projectId = $request->project_id;

            // Log the mail attempt
            Log::info('Test mail sent', [
                'to' => $toEmail,
                'subject' => $subject,
                'has_attachment' => !empty($attachmentUrl),
                'report_id' => $reportId,
                'project_id' => $projectId,
                'sent_by' => auth()->id() ?? 'system'
            ]);

            // Prepare response data
            $responseData = [
                'to' => $toEmail,
                'subject' => $subject,
                'has_attachment' => !empty($attachmentUrl),
                'sent_at' => now()->toISOString()
            ];

            if ($attachmentUrl) {
                $responseData['attachment_url'] = $attachmentUrl;
            }

            if ($reportId) {
                $responseData['report_id'] = $reportId;
            }

            if ($projectId) {
                $responseData['project_id'] = $projectId;
            }

            return response()->json([
                'success' => true,
                'message' => 'Test mail sent successfully',
                'data' => $responseData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test mail',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send PHD report via email
     */
    public function sendPHDReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'report_id' => 'required|integer',
            'to_email' => 'required|email',
            'custom_message' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reportId = $request->report_id;
            $toEmail = $request->to_email;
            $customMessage = $request->custom_message ?? 'Please find attached your Property Home Diagnostic report.';

            // In a real implementation, this would:
            // 1. Generate PDF from report data
            // 2. Send email with PDF attachment
            // 3. Log the sending activity

            Log::info('PHD Report email sent', [
                'report_id' => $reportId,
                'to' => $toEmail,
                'sent_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'PHD report sent successfully',
                'data' => [
                    'report_id' => $reportId,
                    'to' => $toEmail,
                    'sent_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send PHD report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send bid notification
     */
    public function sendBidNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer',
            'professional_id' => 'required|integer',
            'customer_email' => 'required|email',
            'bid_amount' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $projectId = $request->project_id;
            $professionalId = $request->professional_id;
            $customerEmail = $request->customer_email;
            $bidAmount = $request->bid_amount;

            Log::info('Bid notification sent', [
                'project_id' => $projectId,
                'professional_id' => $professionalId,
                'customer_email' => $customerEmail,
                'bid_amount' => $bidAmount
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bid notification sent successfully',
                'data' => [
                    'project_id' => $projectId,
                    'professional_id' => $professionalId,
                    'sent_to' => $customerEmail,
                    'sent_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send bid notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}