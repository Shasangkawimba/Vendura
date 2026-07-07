<?php

namespace App\Enums;

enum ApprovalStage: string
{
    case MANAGER = 'MANAGER';
    case FINANCE = 'FINANCE';
    case DIREKTUR = 'DIREKTUR';
}
