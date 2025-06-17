import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
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
    description: 'Type of transactions this category is for',
    enum: TransactionType,
    example: TransactionType.Expense,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Whether this is a default category',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  defaultCategory?: boolean;

  @ApiProperty({
    description: 'Icon resource identifier',
    example: 'shopping_cart',
  })
  @IsOptional()
  @IsString()
  iconRes?: string;

  @ApiProperty({
    description: 'Icon color in hex format',
    example: '#FF5733',
  })
  @IsOptional()
  @IsString()
  iconColor?: string;
}
