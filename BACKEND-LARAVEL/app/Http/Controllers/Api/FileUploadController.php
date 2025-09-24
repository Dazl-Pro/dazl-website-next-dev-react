<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Services\FileUploadService;

class FileUploadController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Upload image - Used by frontend as /getImage
     */
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'type' => 'nullable|string|in:project,phd_report,portfolio,profile,other',
            'entity_id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadType = $request->get('type', 'other');
            $entityId = $request->get('entity_id');

            $result = $this->fileUploadService->uploadImage(
                $request->file('image'),
                "images/{$uploadType}",
                [] // no thumbnail sizes for now
            );

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'filename' => $result['filename'],
                    'path' => $result['path'],
                    'url' => $result['url'],
                    'size' => $result['size'],
                    'type' => $uploadType
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Image upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple images
     */
    public function uploadMultipleImages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
            'type' => 'nullable|string|in:project,phd_report,portfolio,profile,other',
            'entity_id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadType = $request->get('type', 'other');
            $entityId = $request->get('entity_id');
            $images = $request->file('images');
            $uploadedFiles = [];

            foreach ($images as $image) {
                $result = $this->fileUploadService->uploadImage($image, "images/{$uploadType}", []);
                $uploadedFiles[] = $result;
            }

            return response()->json([
                'success' => true,
                'message' => count($uploadedFiles) . ' images uploaded successfully',
                'data' => $uploadedFiles
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Multiple image upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload document/file
     */
    public function uploadDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
            'type' => 'nullable|string|in:contract,report,license,insurance,other',
            'entity_id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadType = $request->get('type', 'other');
            $entityId = $request->get('entity_id');

            $result = $this->fileUploadService->uploadFile(
                $request->file('document'),
                "documents/{$uploadType}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => [
                    'filename' => $result['filename'],
                    'path' => $result['path'],
                    'url' => $result['url'],
                    'size' => $result['size'],
                    'type' => $uploadType
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete uploaded file
     */
    public function deleteFile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $filename = $request->get('filename');

            if ($this->fileUploadService->deleteFile("uploads/{$filename}")) {
                return response()->json([
                    'success' => true,
                    'message' => 'File deleted successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found or deletion failed'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get file info
     */
    public function getFileInfo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $filename = $request->get('filename');
            $info = $this->fileUploadService->getFileInfo("uploads/{$filename}");

            if ($info) {
                return response()->json([
                    'success' => true,
                    'data' => $info
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get file info',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}