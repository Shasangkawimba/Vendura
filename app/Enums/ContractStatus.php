<?php

namespace App\Enums;

enum ContractStatus: string
{
    case DRAFT = 'DRAFT';
    case MENUNGGU_MANAGER = 'MENUNGGU_MANAGER';
    case MENUNGGU_FINANCE = 'MENUNGGU_FINANCE';
    case MENUNGGU_DIREKTUR = 'MENUNGGU_DIREKTUR';
    case AKTIF = 'AKTIF';
    case DITOLAK = 'DITOLAK';
    case EXPIRED = 'EXPIRED';
}
