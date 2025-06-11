import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  password: string;
}
