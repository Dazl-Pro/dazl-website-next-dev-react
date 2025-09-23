<?php

namespace App\Services;

use App\Models\HomeDiagnosticReport;
use App\Models\Project;
use App\Models\Customer;
use Illuminate\Support\Facades\Http;

class HomeDiagnosticReportService
{
    /**
     * Create a new PHD report
     */
    public function createReport(array $data, $realtorId): array
    {
        $report = HomeDiagnosticReport::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'client_email' => $data['client_email'],
            'street_no' => $data['street_no'],
            'street_name' => $data['street_name'],
            'city' => $data['city'],
            'state' => $data['state'],
            'zip_code' => $data['zip_code'],
            'highest_price' => $data['highest_price'],
            'lowest_price' => $data['lowest_price'],
            'year_built' => $data['year_built'],
            'bathrooms' => $data['bathrooms'],
            'bedrooms' => $data['bedrooms'],
            'basement' => $data['basement'],
            'gross_size' => $data['gross_size'],
            'spaces' => $data['spaces'],
            'parking_features' => $data['parking_features'],
            'property_stories' => $data['property_stories'],
            'structure_type' => $data['structure_type'],
            'lot_size' => $data['lot_size'],
            'location' => $data['location'],
            'foundation_type' => $data['foundation_type'],
            'tax_accessed_value' => $data['tax_accessed_value'],
            'annual_tax_amount' => $data['annual_tax_amount'],
            'sale_date' => $data['sale_date'],
            'sale_amount' => $data['sale_amount'],
            'type' => $data['type'],
            'phd_description' => $data['phd_description'],
            'realtor_id' => $realtorId,
        ]);

        // Find or create customer
        $customer = $this->findOrCreateCustomer($data);

        if ($customer) {
            $report->update(['customer_id' => $customer->id]);
        }

        // Create associated project if needed
        $project = null;
        if (!isset($data['project_id'])) {
            $project = $this->createAssociatedProject($report, $customer);
        }

        return [
            'report' => $report,
            'project' => $project,
            'customer' => $customer
        ];
    }

    /**
     * Update PHD report by ID
     */
    public function updateReport(int $id, array $data): ?HomeDiagnosticReport
    {
        $report = HomeDiagnosticReport::find($id);

        if (!$report) {
            return null;
        }

        $report->update($data);
        return $report->fresh();
    }

    /**
     * Delete PHD report by ID
     */
    public function deleteReport(int $id): bool
    {
        try {
            $report = HomeDiagnosticReport::find($id);

            if (!$report) {
                return false;
            }

            // Delete associated projects
            $report->projects()->delete();

            // Delete the report
            $report->delete();

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get reports for realtor
     */
    public function getReportsForRealtor($realtorId, array $filters = [])
    {
        $query = HomeDiagnosticReport::with(['projects', 'customer'])
                                   ->where('realtor_id', $realtorId);

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('last_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('location', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (isset($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (isset($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get single report for realtor
     */
    public function getReportForRealtor(int $reportId, int $realtorId): ?HomeDiagnosticReport
    {
        return HomeDiagnosticReport::with(['projects', 'customer'])
                                 ->where('id', $reportId)
                                 ->where('realtor_id', $realtorId)
                                 ->first();
    }

    /**
     * Get house data from external API
     */
    public function getHouseData(string $address): array
    {
        try {
            // TODO: Implement actual external API integration
            // For now, return mock data based on the address

            // This would typically call a real estate data API like:
            // - Zillow API
            // - RentSpree API
            // - MLS data
            // - County records API

            return [
                'type' => 'Single Family',
                'year_built' => rand(1950, 2020),
                'bedrooms' => rand(2, 5),
                'bathrooms' => rand(1, 4),
                'structure_type' => 'Frame',
                'lot_size' => '0.' . rand(10, 50) . ' acres',
                'location' => $address,
                'foundation_type' => 'Concrete',
                'tax_accessed_value' => rand(150000, 500000),
                'sale_date' => now()->subMonths(rand(1, 24))->format('Y-m-d'),
                'estimated' => true // Flag to indicate this is estimated data
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Unable to fetch house data',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Generate PDF report
     */
    public function generatePDF(HomeDiagnosticReport $report): string
    {
        // TODO: Implement PDF generation using Laravel DOMPDF or similar
        // This would generate a professional PHD report PDF

        return 'pdf_generation_not_implemented';
    }

    /**
     * Send report via email
     */
    public function emailReport(HomeDiagnosticReport $report, array $recipients = []): bool
    {
        try {
            // TODO: Implement email sending logic
            // This would send the PHD report to the client

            $defaultRecipients = [$report->client_email];
            $allRecipients = array_merge($defaultRecipients, $recipients);

            // Mail logic would go here

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Find or create customer from report data
     */
    private function findOrCreateCustomer(array $data): ?Customer
    {
        try {
            // Try to find existing customer by email
            $customer = Customer::where('email', $data['client_email'])->first();

            if (!$customer) {
                // Create new customer
                $customer = Customer::create([
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'email' => $data['client_email'],
                    'zip_code' => $data['zip_code'],
                    'password' => bcrypt('temp_password_' . now()->timestamp)
                ]);
            }

            return $customer;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Create associated project for PHD report
     */
    private function createAssociatedProject(HomeDiagnosticReport $report, ?Customer $customer): Project
    {
        return Project::create([
            'title' => 'PHD Report Project - ' . $report->location,
            'description' => $report->phd_description,
            'location' => $report->location,
            'home_diagnostic_report_id' => $report->id,
            'realtor_id' => $report->realtor_id,
            'customer_id' => $customer?->id,
            'status' => 'draft'
        ]);
    }
}