import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, ParseDatePipe],
  exports: [TransactionsService],
})
export class TransactionsModule {}
