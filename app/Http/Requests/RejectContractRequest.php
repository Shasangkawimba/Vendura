<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('approve', $this->route('contract'));
    }

    public function rules(): array
    {
        return [
            'note' => ['required', 'string', 'max:1000'],
        ];
    }
}
