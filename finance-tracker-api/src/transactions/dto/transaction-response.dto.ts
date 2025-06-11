import { TransactionType } from '../entities/transaction.entity';

export class TransactionResponseDto {
  id: string;
  categoryId: string;
  sourceId: string;
  description?: string;
  amount: number;
  timestamp: number;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
} 