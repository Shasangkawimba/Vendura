<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadContractVersionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('contract'));
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'file', 'mimes:pdf,docx,jpg,png', 'max:10240'],
        ];
    }
}
