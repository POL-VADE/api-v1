import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneNumberRequestDto {
  @ApiProperty({
    description: "User's phone number in international format",
    example: '+1234567890',
    pattern: '^\\+[1-9]\\d{1,14}$',
  })
  @IsPhoneNumber()
  phoneNumber: string;
}
