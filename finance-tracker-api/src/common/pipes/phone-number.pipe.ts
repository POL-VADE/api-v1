import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PhoneNumberPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Phone number is required');
    }

    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // Check if the phone number is valid (10 digits)
    if (cleaned.length !== 10) {
      throw new BadRequestException('Phone number must be 10 digits');
    }

    // Format the phone number as (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
} 