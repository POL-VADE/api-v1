import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ description: 'Category ID for the budget' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Budget amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Start date of the budget period (timestamp)' })
  @IsNumber()
  startDate: number;

  @ApiProperty({ description: 'End date of the budget period (timestamp)' })
  @IsNumber()
  endDate: number;

  @ApiProperty({
    description: 'Optional description of the budget',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
