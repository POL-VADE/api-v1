import { IsString, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User\'s phone number in international format',
    example: '+1234567890',
    pattern: '^\\+[1-9]\\d{1,14}$'
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'User\'s password (minimum 6 characters)',
    example: 'securePassword123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User\'s full name',
    example: 'John Doe'
  })
  @IsString()
  name: string;
} 