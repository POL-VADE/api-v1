import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { VerifyOtpDto } from '../users/dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('request-registration-otp')
  @ApiOperation({ summary: 'Request OTP for registration' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async requestRegistrationOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestRegistrationOTP(phoneNumber);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with OTP verification' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        phoneNumber: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 409, description: 'Phone number already registered' })
  async register(@Body() verifyOtpDto: VerifyOtpDto, @Body() createUserDto: CreateUserDto) {
    await this.authService.verifyOTP(verifyOtpDto.phoneNumber, verifyOtpDto.otp, 'register');
    const user = await this.authService.register(createUserDto);
    return this.authService.login(user);
  }

  @Post('request-login-otp')
  @ApiOperation({ summary: 'Request OTP for login' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async requestLoginOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestLoginOTP(phoneNumber);
  }

  @Post('verify-login-otp')
  @ApiOperation({ summary: 'Verify OTP for login' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            phoneNumber: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyLoginOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOTP(verifyOtpDto.phoneNumber, verifyOtpDto.otp, 'login');
    const user = await this.usersService.findByPhoneNumber(verifyOtpDto.phoneNumber);
    return this.authService.login(user);
  }
}
