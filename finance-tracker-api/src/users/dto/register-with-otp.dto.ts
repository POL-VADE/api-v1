import { IsString, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWithOtpDto {
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

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  otp: string;
}
