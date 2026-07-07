<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;
use App\Enums\UserRole;

class ContractPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Contract $contract): bool
    {
        if (in_array($user->role, [UserRole::MANAGER, UserRole::FINANCE, UserRole::DIREKTUR, UserRole::ADMIN])) {
            return true;
        }
        return $user->id === $contract->created_by;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::MANAGER;
    }

    public function approve(User $user, Contract $contract): bool
    {
        $pendingStage = match ($contract->status->value) {
            'MENUNGGU_MANAGER' => UserRole::MANAGER->value,
            'MENUNGGU_FINANCE' => UserRole::FINANCE->value,
            'MENUNGGU_DIREKTUR' => UserRole::DIREKTUR->value,
            default => null,
        };

        return $pendingStage === $user->role->value;
    }
}
