import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { VerifyOtpDto } from '../users/dto/verify-otp.dto';
import { RegisterWithOtpDto } from '../users/dto/register-with-otp.dto';
import { OtpResponseDto } from './dto/otp-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PhoneNumberRequestDto } from './dto/phone-number-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('request-otp')
  @ApiOperation({
    summary: 'Request OTP',
    description:
      'Unified endpoint for both registration and login OTP requests. Always returns success to prevent user enumeration attacks. Automatically determines whether to send registration or login OTP based on user existence.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    type: OtpResponseDto,
  })
  async requestOtp(@Body() phoneNumberDto: PhoneNumberRequestDto) {
    return this.authService.requestOTP(phoneNumberDto.phoneNumber);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with OTP verification' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 409, description: 'Phone number already registered' })
  async register(@Body() registerWithOtpDto: RegisterWithOtpDto) {
    await this.authService.verifyOTP(
      registerWithOtpDto.phoneNumber,
      registerWithOtpDto.otp,
      'register',
    );

    const createUserDto: CreateUserDto = {
      phoneNumber: registerWithOtpDto.phoneNumber,
      name: registerWithOtpDto.name,
    };

    const user = await this.authService.register(createUserDto);
    return this.authService.login(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with OTP verification' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async login(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOTP(verifyOtpDto.phoneNumber, verifyOtpDto.otp, 'login');
    const user = await this.usersService.findByPhoneNumberSafe(verifyOtpDto.phoneNumber);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.authService.login(user);
  }
}
