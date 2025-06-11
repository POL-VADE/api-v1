import { IsString, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Groceries',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Whether this is a default category',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  defaultCategory?: boolean;

  @ApiProperty({
    description: 'Type of transactions this category is for',
    enum: TransactionType,
    example: TransactionType.Expense,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Icon resource identifier',
    example: 'shopping_cart',
  })
  @IsString()
  @IsOptional()
  iconRes?: string;

  @ApiProperty({
    description: 'Icon color in hex format',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  iconColor?: string;
}
