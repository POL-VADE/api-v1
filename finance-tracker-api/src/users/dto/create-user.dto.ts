import { IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "User's phone number in international format",
    example: '+1234567890',
    pattern: '^\\+[1-9]\\d{1,14}$',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  @IsString()
  name: string;
}
