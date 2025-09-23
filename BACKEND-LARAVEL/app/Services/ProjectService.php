<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\ProjectOpportunity;
use App\Models\Professional;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectService
{
    /**
     * Create a new project
     */
    public function createProject(array $data, $userId): Project
    {
        return Project::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'budget_min' => $data['budget_min'] ?? null,
            'budget_max' => $data['budget_max'] ?? null,
            'location' => $data['location'],
            'customer_id' => $userId,
            'status' => 'draft',
        ]);
    }

    /**
     * Update existing project
     */
    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);
        return $project->fresh();
    }

    /**
     * Delete project and related data
     */
    public function deleteProject(Project $project): bool
    {
        try {
            // Delete project images
            $this->deleteProjectImages($project);

            // Delete project opportunities
            $project->projectOpportunities()->delete();

            // Delete the project
            $project->delete();

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Upload and store project images
     */
    public function uploadProjectImages(Project $project, array $images): array
    {
        $uploadedImages = [];

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('project_images', $filename, 'public');

                $projectImage = ProjectImage::create([
                    'project_id' => $project->id,
                    'url' => $path,
                    'description' => 'Project image',
                    'alt_text' => $project->title . ' image'
                ]);

                $uploadedImages[] = $projectImage;
            }
        }

        return $uploadedImages;
    }

    /**
     * Delete project images
     */
    public function deleteProjectImages(Project $project): bool
    {
        try {
            $images = $project->projectImages;

            foreach ($images as $image) {
                // Delete file from storage
                Storage::disk('public')->delete($image->url);
                // Delete record from database
                $image->delete();
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Publish project and notify professionals
     */
    public function publishProject(Project $project, array $serviceTypeIds): array
    {
        // Update project status
        $project->update(['status' => 'published']);

        // Find relevant professionals
        $professionals = Professional::whereHas('serviceTypes', function ($query) use ($serviceTypeIds) {
            $query->whereIn('service_types.id', $serviceTypeIds);
        })->get();

        // Create project opportunities
        $opportunities = [];
        foreach ($professionals as $professional) {
            $opportunity = ProjectOpportunity::create([
                'project_id' => $project->id,
                'professional_id' => $professional->id,
                'customer_id' => $project->customer_id,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);
            $opportunities[] = $opportunity;
        }

        return [
            'project' => $project->fresh(),
            'professionals_notified' => $professionals->count(),
            'opportunities_created' => count($opportunities)
        ];
    }

    /**
     * Get projects for customer
     */
    public function getCustomerProjects($customerId, array $filters = [])
    {
        $query = Project::with(['projectImages', 'professional'])
                       ->where('customer_id', $customerId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get projects for professional
     */
    public function getProfessionalProjects($professionalId, array $filters = [])
    {
        $query = Project::with(['projectImages', 'customer'])
                       ->where('professional_id', $professionalId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get project opportunities for professional
     */
    public function getProjectOpportunities($professionalId, array $filters = [])
    {
        $query = ProjectOpportunity::with(['project.projectImages', 'customer'])
                                  ->where('professional_id', $professionalId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Accept project opportunity
     */
    public function acceptOpportunity(ProjectOpportunity $opportunity, array $bidData): ProjectOpportunity
    {
        $opportunity->update([
            'status' => 'accepted',
            'bid_amount' => $bidData['bid_amount'] ?? null,
            'estimated_completion_days' => $bidData['estimated_completion_days'] ?? null,
            'notes' => $bidData['notes'] ?? null,
            'accepted_at' => now(),
        ]);

        // Update project with professional
        $opportunity->project->update([
            'professional_id' => $opportunity->professional_id,
            'status' => 'in_progress'
        ]);

        return $opportunity->fresh();
    }

    /**
     * Reject project opportunity
     */
    public function rejectOpportunity(ProjectOpportunity $opportunity, string $reason = null): ProjectOpportunity
    {
        $opportunity->update([
            'status' => 'rejected',
            'notes' => $reason,
            'rejected_at' => now(),
        ]);

        return $opportunity->fresh();
    }
}