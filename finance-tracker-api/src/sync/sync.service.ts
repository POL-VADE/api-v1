import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoriesService } from '../categories/categories.service';
import { SourcesService } from '../sources/sources.service';
import { BudgetsService } from '../budgets/budgets.service';
import { SyncRepository } from './repositories/sync.repository';
import {
  ISyncService,
  ISyncStatus,
  ISyncChanges,
  ISyncResponse,
  ISyncResults,
} from './interfaces/sync.interface';
import { Transaction, Category, Source, Budget } from '@prisma/client';

type EntityWithDeleted<T> = T & { deleted?: boolean };

@Injectable()
export class SyncService implements ISyncService {
  constructor(
    private prisma: PrismaService,
    private syncRepository: SyncRepository,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private sourcesService: SourcesService,
    private budgetsService: BudgetsService,
  ) {}

  async getSyncStatus(userId: string): Promise<ISyncStatus> {
    const [lastTransaction, lastCategory, lastSource, lastBudget] = await Promise.all([
      this.syncRepository.getLastUpdate(this.prisma.transaction, userId),
      this.syncRepository.getLastUpdate(this.prisma.category, userId),
      this.syncRepository.getLastUpdate(this.prisma.source, userId),
      this.syncRepository.getLastUpdate(this.prisma.budget, userId),
    ]);

    return {
      lastSync: new Date(),
      lastTransactionUpdate: lastTransaction,
      lastCategoryUpdate: lastCategory,
      lastSourceUpdate: lastSource,
      lastBudgetUpdate: lastBudget,
    };
  }

  async getChanges(userId: string, lastSync: Date): Promise<ISyncChanges> {
    const [transactions, categories, sources, budgets] = await Promise.all([
      this.syncRepository.getChanges<Transaction>(this.prisma.transaction, userId, lastSync, {
        category: true,
        source: true,
      }),
      this.syncRepository.getChanges<Category>(this.prisma.category, userId, lastSync),
      this.syncRepository.getChanges<Source>(this.prisma.source, userId, lastSync),
      this.syncRepository.getChanges<Budget>(this.prisma.budget, userId, lastSync, {
        category: true,
      }),
    ]);

    return {
      transactions: transactions as EntityWithDeleted<Transaction>[],
      categories: categories as EntityWithDeleted<Category>[],
      sources: sources as EntityWithDeleted<Source>[],
      budgets: budgets as EntityWithDeleted<Budget>[],
    };
  }

  private createEmptyResults(): ISyncResults {
    return {
      transactions: { created: 0, updated: 0, deleted: 0 },
      categories: { created: 0, updated: 0, deleted: 0 },
      sources: { created: 0, updated: 0, deleted: 0 },
      budgets: { created: 0, updated: 0, deleted: 0 },
    };
  }

  private updateResults(
    results: ISyncResults,
    entityType: keyof ISyncResults,
    operation: 'created' | 'updated' | 'deleted',
  ): void {
    results[entityType][operation]++;
  }

  async syncChanges(userId: string, changes: ISyncChanges): Promise<ISyncResponse> {
    const results = this.createEmptyResults();

    // Handle transactions
    for (const transaction of changes.transactions) {
      const operation = await this.syncRepository.handleEntitySync(
        this.prisma.transaction,
        userId,
        transaction,
        this.transactionsService,
      );
      this.updateResults(results, 'transactions', operation);
    }

    // Handle categories
    for (const category of changes.categories) {
      const operation = await this.syncRepository.handleEntitySync(
        this.prisma.category,
        userId,
        category,
        this.categoriesService,
      );
      this.updateResults(results, 'categories', operation);
    }

    // Handle sources
    for (const source of changes.sources) {
      const operation = await this.syncRepository.handleEntitySync(
        this.prisma.source,
        userId,
        source,
        this.sourcesService,
      );
      this.updateResults(results, 'sources', operation);
    }

    // Handle budgets
    for (const budget of changes.budgets) {
      const operation = await this.syncRepository.handleEntitySync(
        this.prisma.budget,
        userId,
        budget,
        this.budgetsService,
      );
      this.updateResults(results, 'budgets', operation);
    }

    return {
      success: true,
      results,
      syncStatus: await this.getSyncStatus(userId),
    };
  }
}
