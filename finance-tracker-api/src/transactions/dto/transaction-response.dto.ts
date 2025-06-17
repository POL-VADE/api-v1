import { TransactionType } from "@prisma/client";

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