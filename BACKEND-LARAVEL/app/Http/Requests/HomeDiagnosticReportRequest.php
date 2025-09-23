<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class HomeDiagnosticReportRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'client_email' => 'required|email',
            'street_no' => 'required|string|max:50',
            'street_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'highest_price' => 'required|numeric|min:0',
            'lowest_price' => 'required|numeric|min:0|lte:highest_price',
            'year_built' => 'required|integer|min:1800|max:' . (date('Y') + 5),
            'bathrooms' => 'required|integer|min:0|max:20',
            'bedrooms' => 'required|integer|min:0|max:20',
            'basement' => 'required|string|max:255',
            'gross_size' => 'required|string|max:255',
            'spaces' => 'required|string|max:255',
            'parking_features' => 'required|string|max:255',
            'property_stories' => 'required|string|max:255',
            'structure_type' => 'required|string|max:255',
            'lot_size' => 'required|string|max:255',
            'location' => 'required|string|max:500',
            'foundation_type' => 'required|string|max:255',
            'tax_accessed_value' => 'required|numeric|min:0',
            'annual_tax_amount' => 'required|numeric|min:0',
            'sale_date' => 'required|date|before_or_equal:today',
            'sale_amount' => 'required|numeric|min:0',
            'type' => 'required|string|max:255',
            'phd_description' => 'required|string|max:2000',
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
            'first_name.required' => 'Client first name is required',
            'last_name.required' => 'Client last name is required',
            'client_email.required' => 'Client email address is required',
            'client_email.email' => 'Please provide a valid client email address',
            'street_no.required' => 'Street number is required',
            'street_name.required' => 'Street name is required',
            'city.required' => 'City is required',
            'state.required' => 'State is required',
            'zip_code.required' => 'ZIP code is required',
            'highest_price.required' => 'Highest price estimate is required',
            'highest_price.numeric' => 'Highest price must be a valid number',
            'highest_price.min' => 'Highest price cannot be negative',
            'lowest_price.required' => 'Lowest price estimate is required',
            'lowest_price.numeric' => 'Lowest price must be a valid number',
            'lowest_price.min' => 'Lowest price cannot be negative',
            'lowest_price.lte' => 'Lowest price must be less than or equal to highest price',
            'year_built.required' => 'Year built is required',
            'year_built.integer' => 'Year built must be a valid year',
            'year_built.min' => 'Year built cannot be before 1800',
            'year_built.max' => 'Year built cannot be more than 5 years in the future',
            'bathrooms.required' => 'Number of bathrooms is required',
            'bathrooms.integer' => 'Number of bathrooms must be a whole number',
            'bathrooms.min' => 'Number of bathrooms cannot be negative',
            'bathrooms.max' => 'Number of bathrooms seems unrealistic (max 20)',
            'bedrooms.required' => 'Number of bedrooms is required',
            'bedrooms.integer' => 'Number of bedrooms must be a whole number',
            'bedrooms.min' => 'Number of bedrooms cannot be negative',
            'bedrooms.max' => 'Number of bedrooms seems unrealistic (max 20)',
            'basement.required' => 'Basement information is required',
            'gross_size.required' => 'Gross size information is required',
            'spaces.required' => 'Spaces information is required',
            'parking_features.required' => 'Parking features information is required',
            'property_stories.required' => 'Property stories information is required',
            'structure_type.required' => 'Structure type is required',
            'lot_size.required' => 'Lot size is required',
            'location.required' => 'Property location is required',
            'foundation_type.required' => 'Foundation type is required',
            'tax_accessed_value.required' => 'Tax assessed value is required',
            'tax_accessed_value.numeric' => 'Tax assessed value must be a valid number',
            'tax_accessed_value.min' => 'Tax assessed value cannot be negative',
            'annual_tax_amount.required' => 'Annual tax amount is required',
            'annual_tax_amount.numeric' => 'Annual tax amount must be a valid number',
            'annual_tax_amount.min' => 'Annual tax amount cannot be negative',
            'sale_date.required' => 'Sale date is required',
            'sale_date.date' => 'Sale date must be a valid date',
            'sale_date.before_or_equal' => 'Sale date cannot be in the future',
            'sale_amount.required' => 'Sale amount is required',
            'sale_amount.numeric' => 'Sale amount must be a valid number',
            'sale_amount.min' => 'Sale amount cannot be negative',
            'type.required' => 'Property type is required',
            'phd_description.required' => 'PHD description is required',
            'phd_description.max' => 'PHD description cannot exceed 2000 characters',
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
            'first_name' => 'client first name',
            'last_name' => 'client last name',
            'client_email' => 'client email',
            'street_no' => 'street number',
            'street_name' => 'street name',
            'zip_code' => 'ZIP code',
            'highest_price' => 'highest price estimate',
            'lowest_price' => 'lowest price estimate',
            'year_built' => 'year built',
            'bathrooms' => 'number of bathrooms',
            'bedrooms' => 'number of bedrooms',
            'gross_size' => 'gross size',
            'parking_features' => 'parking features',
            'property_stories' => 'property stories',
            'structure_type' => 'structure type',
            'lot_size' => 'lot size',
            'foundation_type' => 'foundation type',
            'tax_accessed_value' => 'tax assessed value',
            'annual_tax_amount' => 'annual tax amount',
            'sale_date' => 'sale date',
            'sale_amount' => 'sale amount',
            'phd_description' => 'PHD description',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean and prepare numeric values
        $numericFields = ['highest_price', 'lowest_price', 'tax_accessed_value', 'annual_tax_amount', 'sale_amount'];

        foreach ($numericFields as $field) {
            if ($this->has($field)) {
                $this->merge([
                    $field => $this->sanitizeNumeric($this->input($field)),
                ]);
            }
        }

        // Clean and prepare integer values
        $integerFields = ['year_built', 'bathrooms', 'bedrooms'];

        foreach ($integerFields as $field) {
            if ($this->has($field)) {
                $this->merge([
                    $field => $this->sanitizeInteger($this->input($field)),
                ]);
            }
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
     * Sanitize integer input
     */
    private function sanitizeInteger($value): ?int
    {
        if (is_null($value) || $value === '') {
            return null;
        }

        // Remove non-numeric characters except minus sign
        $cleaned = preg_replace('/[^\d-]/', '', $value);

        return is_numeric($cleaned) ? (int) $cleaned : null;
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