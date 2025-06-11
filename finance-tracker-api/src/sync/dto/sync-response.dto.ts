import { ApiProperty } from '@nestjs/swagger';
import { SyncStatusDto } from './sync-status.dto';

class SyncResultDto {
  @ApiProperty({
    description: 'Number of items created',
    example: 5,
  })
  created: number;

  @ApiProperty({
    description: 'Number of items updated',
    example: 3,
  })
  updated: number;

  @ApiProperty({
    description: 'Number of items deleted',
    example: 1,
  })
  deleted: number;
}

class SyncResultsDto {
  @ApiProperty({
    description: 'Results for transactions sync',
    type: SyncResultDto,
  })
  transactions: SyncResultDto;

  @ApiProperty({
    description: 'Results for categories sync',
    type: SyncResultDto,
  })
  categories: SyncResultDto;

  @ApiProperty({
    description: 'Results for sources sync',
    type: SyncResultDto,
  })
  sources: SyncResultDto;

  @ApiProperty({
    description: 'Results for budgets sync',
    type: SyncResultDto,
  })
  budgets: SyncResultDto;
}

export class SyncResponseDto {
  @ApiProperty({
    description: 'Whether the sync was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Results of the sync operation',
    type: SyncResultsDto,
  })
  results: SyncResultsDto;

  @ApiProperty({
    description: 'Current sync status',
    type: SyncStatusDto,
  })
  syncStatus: SyncStatusDto;
}
