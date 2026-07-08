<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadComplianceDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'expiry_date' => ['required', 'date', 'after:today'],
        ];
    }
}
