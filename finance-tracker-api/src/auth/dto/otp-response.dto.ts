import { ApiProperty } from '@nestjs/swagger';

export class OtpResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'OTP sent successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The OTP code (only returned in development environment for testing purposes)',
    example: '123456',
    required: false,
  })
  otp?: string;
}
