import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Source } from '../../sources/entities/source.entity';

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense'
}

@Entity('zt_transaction')
@Index(['categoryId', 'sourceId', 'timestamp'])
@Index(['userId', 'timestamp'])
export class Transaction {
  @PrimaryColumn('uuid', { name: 'transaction_id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'category_id_fk' })
  categoryId: string;

  @Column({ name: 'source_id_fk' })
  sourceId: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('bigint')
  timestamp: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id_fk' })
  category: Category;

  @ManyToOne(() => Source, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_id_fk' })
  source: Source;
} 