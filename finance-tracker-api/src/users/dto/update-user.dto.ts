import { IsString, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
} 