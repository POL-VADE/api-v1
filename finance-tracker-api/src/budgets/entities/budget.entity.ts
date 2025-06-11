import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('zt_budget')
@Index(['userId', 'startDate'])
@Index(['categoryId', 'startDate'])
export class Budget {
  @PrimaryColumn('uuid', { name: 'budget_id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'category_id_fk' })
  categoryId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('bigint')
  startDate: number;

  @Column('bigint')
  endDate: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id_fk' })
  category: Category;
} 