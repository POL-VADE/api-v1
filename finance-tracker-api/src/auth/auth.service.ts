import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { randomInt } from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { otp: string; expiresAt: Date; type: 'login' | 'register' }> =
    new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  private storeOTP(phoneNumber: string, otp: string, type: 'login' | 'register') {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    this.otpStore.set(phoneNumber, { otp, expiresAt, type });
  }

  async requestOTP(phoneNumber: string) {
    // Always return success to prevent user enumeration attacks
    // Send OTP based on user existence and store appropriate type
    try {
      const existingUser = await this.usersService.findByPhoneNumberSafe(phoneNumber);
      const otp = this.generateOTP();

      if (existingUser) {
        // User exists - this will be for login
        this.storeOTP(phoneNumber, otp, 'login');
        console.log(`Login OTP for ${phoneNumber}: ${otp}`); // For development only
      } else {
        // User doesn't exist - this will be for registration
        this.storeOTP(phoneNumber, otp, 'register');
        console.log(`Registration OTP for ${phoneNumber}: ${otp}`); // For development only
      }

      // TODO: Integrate with SMS service to send OTP
      return { message: 'OTP sent successfully', otp };
    } catch (error) {
      // Handle database errors gracefully
      // Still return success for security
      console.log('Database error in requestOTP:', error);
      return { message: 'OTP sent successfully', otp: '------' };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string, type: 'login' | 'register') {
    const storedData = this.otpStore.get(phoneNumber);

    if (!storedData) {
      throw new UnauthorizedException('OTP not found or expired');
    }

    if (new Date() > storedData.expiresAt) {
      this.otpStore.delete(phoneNumber);
      throw new UnauthorizedException('OTP expired');
    }

    if (storedData.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (storedData.type !== type) {
      throw new UnauthorizedException('Invalid OTP type');
    }

    // Additional validation during verification phase
    try {
      const existingUser = await this.usersService.findByPhoneNumberSafe(phoneNumber);

      if (type === 'register' && existingUser) {
        this.otpStore.delete(phoneNumber);
        throw new ConflictException('Phone number already registered');
      }

      if (type === 'login' && !existingUser) {
        this.otpStore.delete(phoneNumber);
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }
      // Log database errors but don't throw them during verification
      console.log('Database error in verifyOTP:', error);
    }

    this.otpStore.delete(phoneNumber);
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
