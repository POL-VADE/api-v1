import { IsString, IsNumber, IsOptional, IsUUID, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The UUID of the category this transaction belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'The UUID of the source (account/wallet) for this transaction',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  sourceId: string;

  @ApiPropertyOptional({
    description: 'Optional description of the transaction',
    example: 'Grocery shopping at Walmart',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 50.99,
    minimum: 0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The date when the transaction occurred',
    example: '2024-03-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;
}
