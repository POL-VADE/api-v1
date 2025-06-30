import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { SourcesModule } from './sources/sources.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { SyncModule } from './sync/sync.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: (config.get<number>('RATE_LIMIT_TTL') || 60) * 1000, // Convert to milliseconds
          limit: config.get<number>('RATE_LIMIT_MAX') || 100,
        },
        {
          name: 'medium',
          ttl: 5 * 60 * 1000, // 5 minutes
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60 * 60 * 1000, // 1 hour
          limit: 100,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    SourcesModule,
    TransactionsModule,
    BudgetsModule,
    SyncModule,
  ],
})
export class AppModule {}
