<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileUploadService
{
    /**
     * Upload single file
     */
    public function uploadFile(UploadedFile $file, string $directory = 'uploads', string $disk = 'public'): array
    {
        try {
            $filename = $this->generateUniqueFilename($file);
            $path = $file->storeAs($directory, $filename, $disk);

            return [
                'success' => true,
                'path' => $path,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'url' => Storage::disk($disk)->url($path)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Upload multiple files
     */
    public function uploadMultipleFiles(array $files, string $directory = 'uploads', string $disk = 'public'): array
    {
        $results = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $results[] = $this->uploadFile($file, $directory, $disk);
            }
        }

        return $results;
    }

    /**
     * Upload and resize image
     */
    public function uploadImage(UploadedFile $file, string $directory = 'images', array $sizes = [], string $disk = 'public'): array
    {
        try {
            // Validate image
            if (!$this->isImage($file)) {
                throw new \Exception('File is not a valid image');
            }

            $filename = $this->generateUniqueFilename($file);
            $path = $file->storeAs($directory, $filename, $disk);

            $result = [
                'success' => true,
                'path' => $path,
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'url' => Storage::disk($disk)->url($path),
                'thumbnails' => []
            ];

            // Create thumbnails if sizes are specified
            if (!empty($sizes)) {
                $result['thumbnails'] = $this->createThumbnails($path, $directory, $filename, $sizes, $disk);
            }

            return $result;
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create image thumbnails
     */
    public function createThumbnails(string $originalPath, string $directory, string $filename, array $sizes, string $disk = 'public'): array
    {
        $thumbnails = [];

        try {
            $originalImage = Image::make(Storage::disk($disk)->path($originalPath));

            foreach ($sizes as $sizeName => $dimensions) {
                $width = $dimensions['width'] ?? null;
                $height = $dimensions['height'] ?? null;

                $thumbnailFilename = $this->getThumbnailFilename($filename, $sizeName);
                $thumbnailPath = $directory . '/thumbnails/' . $thumbnailFilename;

                // Ensure thumbnails directory exists
                Storage::disk($disk)->makeDirectory($directory . '/thumbnails');

                // Resize image
                $resizedImage = clone $originalImage;
                $resizedImage->resize($width, $height, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                // Save thumbnail
                Storage::disk($disk)->put($thumbnailPath, $resizedImage->encode());

                $thumbnails[$sizeName] = [
                    'path' => $thumbnailPath,
                    'url' => Storage::disk($disk)->url($thumbnailPath),
                    'width' => $width,
                    'height' => $height
                ];
            }
        } catch (\Exception $e) {
            // Log error but don't fail the main upload
            \Log::error('Thumbnail creation failed: ' . $e->getMessage());
        }

        return $thumbnails;
    }

    /**
     * Delete file
     */
    public function deleteFile(string $path, string $disk = 'public'): bool
    {
        try {
            return Storage::disk($disk)->delete($path);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Delete file and its thumbnails
     */
    public function deleteImageWithThumbnails(string $path, string $disk = 'public'): bool
    {
        try {
            // Delete original file
            $deleted = Storage::disk($disk)->delete($path);

            // Delete thumbnails directory if it exists
            $directory = dirname($path);
            $thumbnailsDir = $directory . '/thumbnails';

            if (Storage::disk($disk)->exists($thumbnailsDir)) {
                Storage::disk($disk)->deleteDirectory($thumbnailsDir);
            }

            return $deleted;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get file info
     */
    public function getFileInfo(string $path, string $disk = 'public'): array
    {
        try {
            if (!Storage::disk($disk)->exists($path)) {
                throw new \Exception('File not found');
            }

            return [
                'exists' => true,
                'size' => Storage::disk($disk)->size($path),
                'last_modified' => Storage::disk($disk)->lastModified($path),
                'url' => Storage::disk($disk)->url($path),
                'mime_type' => Storage::disk($disk)->mimeType($path)
            ];
        } catch (\Exception $e) {
            return [
                'exists' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate file type
     */
    public function validateFileType(UploadedFile $file, array $allowedTypes): bool
    {
        return in_array($file->getMimeType(), $allowedTypes);
    }

    /**
     * Validate file size
     */
    public function validateFileSize(UploadedFile $file, int $maxSizeInKB): bool
    {
        return $file->getSize() <= ($maxSizeInKB * 1024);
    }

    /**
     * Check if file is an image
     */
    private function isImage(UploadedFile $file): bool
    {
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return in_array($file->getMimeType(), $allowedTypes);
    }

    /**
     * Generate unique filename
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        return Str::uuid() . '.' . $extension;
    }

    /**
     * Get thumbnail filename
     */
    private function getThumbnailFilename(string $originalFilename, string $sizeName): string
    {
        $pathInfo = pathinfo($originalFilename);
        return $pathInfo['filename'] . '_' . $sizeName . '.' . $pathInfo['extension'];
    }
}