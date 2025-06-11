import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SourceType } from '@prisma/client';

export class UpdateSourceDto {
  @ApiProperty({
    enum: SourceType,
    description: 'Type of the source',
    required: false,
  })
  @IsEnum(SourceType)
  @IsOptional()
  type?: SourceType;

  @ApiProperty({
    description: 'Initial balance of the source',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  initialBalance?: number;

  @ApiProperty({ description: 'Title for bank source', required: false })
  @IsString()
  @IsOptional()
  bankSourceTitle?: string;

  @ApiProperty({ description: 'Bank name for bank source', required: false })
  @IsString()
  @IsOptional()
  bankSourceBankName?: string;

  @ApiProperty({ description: 'Card number for bank source', required: false })
  @IsString()
  @IsOptional()
  bankSourceCardNumber?: string;

  @ApiProperty({
    description: 'SMS suggestion flag for bank source',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  bankSourceSmsSuggestion?: boolean;

  @ApiProperty({ description: 'Title for custom source', required: false })
  @IsString()
  @IsOptional()
  customSourceTitle?: string;

  @ApiProperty({
    description: 'Icon resource for custom source',
    required: false,
  })
  @IsString()
  @IsOptional()
  iconRes?: string;

  @ApiProperty({ description: 'Icon color for custom source', required: false })
  @IsString()
  @IsOptional()
  iconColor?: string;
}
