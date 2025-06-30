import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { randomInt } from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { OtpAttempt } from './dto/otp-attempt.dto';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { otp: string; expiresAt: Date; type: 'login' | 'register' }> =
    new Map();
  private otpAttempts: Map<string, OtpAttempt> = new Map();

  // Security constants
  private readonly MAX_OTP_ATTEMPTS = 5;
  private readonly OTP_BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly OTP_EXPIRY_MINUTES = 3; // Reduced from 5 to 3 minutes

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  private storeOTP(phoneNumber: string, otp: string, type: 'login' | 'register') {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);
    this.otpStore.set(phoneNumber, { otp, expiresAt, type });
  }

  private checkOtpAttempts(phoneNumber: string): void {
    const attempt = this.otpAttempts.get(phoneNumber);

    if (attempt && attempt.blockedUntil && new Date() < attempt.blockedUntil) {
      const remainingTime = Math.ceil(
        (attempt.blockedUntil.getTime() - new Date().getTime()) / 60000,
      );
      throw new BadRequestException(
        `Too many failed attempts. Try again in ${remainingTime} minutes.`,
      );
    }
  }

  private recordOtpAttempt(phoneNumber: string, success: boolean): void {
    const now = new Date();
    const attempt = this.otpAttempts.get(phoneNumber) || {
      phoneNumber,
      attempts: 0,
      lastAttempt: now,
    };

    if (success) {
      // Reset attempts on successful verification
      this.otpAttempts.delete(phoneNumber);
      return;
    }

    attempt.attempts += 1;
    attempt.lastAttempt = now;

    if (attempt.attempts >= this.MAX_OTP_ATTEMPTS) {
      attempt.blockedUntil = new Date(now.getTime() + this.OTP_BLOCK_DURATION);
    }

    this.otpAttempts.set(phoneNumber, attempt);
  }

  async requestOTP(phoneNumber: string) {
    // Always return success to prevent user enumeration attacks
    // Send OTP based on user existence and store appropriate type
    try {
      const existingUser = await this.usersService.findByPhoneNumberSafe(phoneNumber);
      const otp = this.generateOTP();
      const isDevelopment = this.configService.get('NODE_ENV') === 'development';

      if (existingUser) {
        // User exists - this will be for login
        this.storeOTP(phoneNumber, otp, 'login');

        // Only log OTP in development environment
        if (isDevelopment) {
          console.log(`Login OTP for ${phoneNumber}: ${otp}`);
        }
      } else {
        // User doesn't exist - this will be for registration
        this.storeOTP(phoneNumber, otp, 'register');

        // Only log OTP in development environment
        if (isDevelopment) {
          console.log(`Registration OTP for ${phoneNumber}: ${otp}`);
        }
      }

      // TODO: Integrate with SMS service to send OTP
      return {
        message: 'OTP sent successfully',
        // Only return OTP in development for testing
        ...(isDevelopment ? { otp } : {}),
      };
    } catch (error) {
      // Handle database errors gracefully
      // Still return success for security
      // Log error without sensitive information
      console.error('Database error in requestOTP - phoneNumber length:', phoneNumber?.length || 0);
      return {
        message: 'OTP sent successfully',
        // Only return placeholder in development
        ...(this.configService.get('NODE_ENV') === 'development' ? { otp: '------' } : {}),
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string, type: 'login' | 'register') {
    // Check if user is blocked due to too many failed attempts
    this.checkOtpAttempts(phoneNumber);

    const storedData = this.otpStore.get(phoneNumber);

    if (!storedData) {
      this.recordOtpAttempt(phoneNumber, false);
      throw new UnauthorizedException('OTP not found or expired');
    }

    if (new Date() > storedData.expiresAt) {
      this.otpStore.delete(phoneNumber);
      this.recordOtpAttempt(phoneNumber, false);
      throw new UnauthorizedException('OTP expired');
    }

    if (storedData.otp !== otp) {
      this.recordOtpAttempt(phoneNumber, false);
      throw new UnauthorizedException('Invalid OTP');
    }

    if (storedData.type !== type) {
      this.recordOtpAttempt(phoneNumber, false);
      throw new UnauthorizedException('Invalid OTP type');
    }

    // Additional validation during verification phase
    try {
      const existingUser = await this.usersService.findByPhoneNumberSafe(phoneNumber);

      if (type === 'register' && existingUser) {
        this.otpStore.delete(phoneNumber);
        this.recordOtpAttempt(phoneNumber, false);
        throw new ConflictException('Phone number already registered');
      }

      if (type === 'login' && !existingUser) {
        this.otpStore.delete(phoneNumber);
        this.recordOtpAttempt(phoneNumber, false);
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }
      // Log database errors but don't throw them during verification
      // Only log non-sensitive information
      console.error('Database error in verifyOTP - phoneNumber length:', phoneNumber?.length || 0);
    }

    // Success - clean up and reset attempts
    this.otpStore.delete(phoneNumber);
    this.recordOtpAttempt(phoneNumber, true);
    return true;
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(user: any) {
    const payload = { sub: user.id, phoneNumber: user.phoneNumber };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
