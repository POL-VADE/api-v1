export interface OtpAttempt {
  phoneNumber: string;
  attempts: number;
  lastAttempt: Date;
  blockedUntil?: Date;
}
