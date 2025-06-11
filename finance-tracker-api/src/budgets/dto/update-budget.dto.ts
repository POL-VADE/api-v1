import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBudgetDto {
  @ApiProperty({ description: 'Category ID for the budget', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Budget amount', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Start date of the budget period (timestamp)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  startDate?: number;

  @ApiProperty({
    description: 'End date of the budget period (timestamp)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  endDate?: number;

  @ApiProperty({
    description: 'Optional description of the budget',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
