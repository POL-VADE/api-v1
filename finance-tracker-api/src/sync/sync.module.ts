import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { CategoriesModule } from '../categories/categories.module';
import { SourcesModule } from '../sources/sources.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { SyncRepository } from './repositories/sync.repository';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [PrismaModule, TransactionsModule, CategoriesModule, SourcesModule, BudgetsModule],
  controllers: [SyncController],
  providers: [SyncService, SyncRepository],
  exports: [SyncService],
})
export class SyncModule {}
