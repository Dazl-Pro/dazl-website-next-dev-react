<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class ProfessionalRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:professionals,email',
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'company_name' => 'required|string|max:255',
            'company_street_address' => 'nullable|string|max:255',
            'company_city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'company_number' => 'required|string|max:255',
            'years' => 'required|string|max:10',
            'check_box' => 'required|accepted',
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
            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'email.unique' => 'This email address is already registered',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Password confirmation does not match',
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'company_name.required' => 'Company name is required',
            'company_city.required' => 'Company city is required',
            'state.required' => 'State is required',
            'zip_code.required' => 'ZIP code is required',
            'company_number.required' => 'Company number/license is required',
            'years.required' => 'Years of experience is required',
            'check_box.accepted' => 'You must accept the terms and conditions',
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
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'company_name' => 'company name',
            'company_street_address' => 'company address',
            'company_city' => 'company city',
            'zip_code' => 'ZIP code',
            'company_number' => 'company license number',
            'years' => 'years of experience',
            'check_box' => 'terms and conditions',
        ];
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