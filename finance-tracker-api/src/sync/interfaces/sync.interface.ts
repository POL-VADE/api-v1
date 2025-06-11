import { Transaction, Category, Source, Budget } from '@prisma/client';

type EntityWithDeleted<T> = T & { deleted?: boolean };

export interface ISyncEntity {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
}

export interface ISyncResult {
  created: number;
  updated: number;
  deleted: number;
}

export interface ISyncResults {
  transactions: ISyncResult;
  categories: ISyncResult;
  sources: ISyncResult;
  budgets: ISyncResult;
}

export interface ISyncStatus {
  lastSync: Date;
  lastTransactionUpdate?: Date;
  lastCategoryUpdate?: Date;
  lastSourceUpdate?: Date;
  lastBudgetUpdate?: Date;
}

export interface ISyncChanges {
  transactions: EntityWithDeleted<Transaction>[];
  categories: EntityWithDeleted<Category>[];
  sources: EntityWithDeleted<Source>[];
  budgets: EntityWithDeleted<Budget>[];
}

export interface ISyncResponse {
  success: boolean;
  results: ISyncResults;
  syncStatus: ISyncStatus;
}

export interface ISyncService {
  getSyncStatus(userId: string): Promise<ISyncStatus>;
  getChanges(userId: string, lastSync: Date): Promise<ISyncChanges>;
  syncChanges(userId: string, changes: ISyncChanges): Promise<ISyncResponse>;
}
