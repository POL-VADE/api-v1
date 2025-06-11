import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        userId,
      },
      include: {
        category: true,
        source: true,
      },
    });
  }

  async findAll(
    userId: string,
    type?: TransactionType,
    startDate?: Date,
    endDate?: Date,
    categoryId?: string,
    sourceId?: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(type && { category: { type } }),
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
      ...(categoryId && { categoryId }),
      ...(sourceId && { sourceId }),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: true,
          source: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        source: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(userId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    await this.findOne(userId, id);

    return this.prisma.transaction.update({
      where: {
        id,
      },
      data: updateTransactionDto,
      include: {
        category: true,
        source: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.transaction.delete({
      where: {
        id,
      },
    });
  }

  async getTransactionStats(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      categoryBreakdown: new Map<string, { amount: number; type: TransactionType }>(),
    };

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      if (transaction.category.type === TransactionType.Income) {
        stats.totalIncome += amount;
      } else {
        stats.totalExpense += amount;
      }

      const categoryKey = transaction.category.id;
      const current = stats.categoryBreakdown.get(categoryKey) || {
        amount: 0,
        type: transaction.category.type,
      };
      current.amount += amount;
      stats.categoryBreakdown.set(categoryKey, current);
    });

    stats.netAmount = stats.totalIncome - stats.totalExpense;

    return {
      ...stats,
      categoryBreakdown: Array.from(stats.categoryBreakdown.entries()).map(
        ([categoryId, data]) => ({
          categoryId,
          ...data,
        }),
      ),
    };
  }
}
