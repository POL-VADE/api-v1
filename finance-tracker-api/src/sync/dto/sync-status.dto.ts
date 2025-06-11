import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncStatusDto {
  @ApiProperty({
    description: 'The timestamp of the last sync',
    example: '2024-03-15T10:30:00Z',
  })
  lastSync: Date;

  @ApiPropertyOptional({
    description: 'The timestamp of the last transaction update',
    example: '2024-03-15T10:30:00Z',
  })
  lastTransactionUpdate?: Date;

  @ApiPropertyOptional({
    description: 'The timestamp of the last category update',
    example: '2024-03-15T10:30:00Z',
  })
  lastCategoryUpdate?: Date;

  @ApiPropertyOptional({
    description: 'The timestamp of the last source update',
    example: '2024-03-15T10:30:00Z',
  })
  lastSourceUpdate?: Date;

  @ApiPropertyOptional({
    description: 'The timestamp of the last budget update',
    example: '2024-03-15T10:30:00Z',
  })
  lastBudgetUpdate?: Date;
}
