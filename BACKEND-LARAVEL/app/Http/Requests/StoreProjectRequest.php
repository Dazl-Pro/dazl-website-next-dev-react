<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0|gte:budget_min',
            'location' => 'required|string|max:255',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max per image
            'service_type_ids' => 'nullable|array',
            'service_type_ids.*' => 'integer|exists:service_types,id',
            'estimated_completion_date' => 'nullable|date|after:today',
            'priority' => 'nullable|in:low,medium,high,urgent',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Project title is required',
            'title.max' => 'Project title cannot exceed 255 characters',
            'description.required' => 'Project description is required',
            'description.max' => 'Project description cannot exceed 2000 characters',
            'budget_min.numeric' => 'Minimum budget must be a valid number',
            'budget_min.min' => 'Minimum budget cannot be negative',
            'budget_max.numeric' => 'Maximum budget must be a valid number',
            'budget_max.min' => 'Maximum budget cannot be negative',
            'budget_max.gte' => 'Maximum budget must be greater than or equal to minimum budget',
            'location.required' => 'Project location is required',
            'images.array' => 'Images must be provided as an array',
            'images.max' => 'You can upload a maximum of 10 images',
            'images.*.image' => 'Each file must be a valid image',
            'images.*.mimes' => 'Images must be in JPEG, JPG, PNG, GIF, or WebP format',
            'images.*.max' => 'Each image must not exceed 5MB',
            'service_type_ids.array' => 'Service types must be provided as an array',
            'service_type_ids.*.integer' => 'Each service type ID must be a valid integer',
            'service_type_ids.*.exists' => 'Selected service type does not exist',
            'estimated_completion_date.date' => 'Estimated completion date must be a valid date',
            'estimated_completion_date.after' => 'Estimated completion date must be in the future',
            'priority.in' => 'Priority must be one of: low, medium, high, urgent',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'budget_min' => 'minimum budget',
            'budget_max' => 'maximum budget',
            'service_type_ids' => 'service types',
            'estimated_completion_date' => 'estimated completion date',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean and prepare budget values
        if ($this->has('budget_min')) {
            $this->merge([
                'budget_min' => $this->sanitizeNumeric($this->budget_min),
            ]);
        }

        if ($this->has('budget_max')) {
            $this->merge([
                'budget_max' => $this->sanitizeNumeric($this->budget_max),
            ]);
        }
    }

    /**
     * Sanitize numeric input
     */
    private function sanitizeNumeric($value): ?float
    {
        if (is_null($value) || $value === '') {
            return null;
        }

        // Remove currency symbols and commas
        $cleaned = preg_replace('/[^\d.]/', '', $value);

        return is_numeric($cleaned) ? (float) $cleaned : null;
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}