import { ApiProperty } from '@nestjs/swagger';
import { Transaction, Category, Source, Budget } from '@prisma/client';

export class SyncChangesDto {
  @ApiProperty({
    description: 'List of transactions to sync',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        categoryId: { type: 'string' },
        sourceId: { type: 'string' },
        amount: { type: 'number' },
        description: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: 'boolean' },
      },
    },
  })
  transactions: (Transaction & { deleted?: boolean })[];

  @ApiProperty({
    description: 'List of categories to sync',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['Income', 'Expense'] },
        defaultCategory: { type: 'boolean' },
        iconRes: { type: 'string' },
        iconColor: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: 'boolean' },
      },
    },
  })
  categories: (Category & { deleted?: boolean })[];

  @ApiProperty({
    description: 'List of sources to sync',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        type: { type: 'string', enum: ['Bank', 'Custom'] },
        initialBalance: { type: 'number' },
        bankSourceTitle: { type: 'string' },
        bankSourceBankName: { type: 'string' },
        bankSourceCardNumber: { type: 'string' },
        bankSourceSmsSuggestion: { type: 'boolean' },
        customSourceTitle: { type: 'string' },
        iconRes: { type: 'string' },
        iconColor: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: 'boolean' },
      },
    },
  })
  sources: (Source & { deleted?: boolean })[];

  @ApiProperty({
    description: 'List of budgets to sync',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        categoryId: { type: 'string' },
        amount: { type: 'number' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: 'boolean' },
      },
    },
  })
  budgets: (Budget & { deleted?: boolean })[];
}
