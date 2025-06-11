import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType } from '../../transactions/entities/transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('zt_category')
export class Category {
  @PrimaryColumn('uuid', { name: 'category_id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column()
  default: boolean;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column()
  iconRes: string;

  @Column()
  iconColor: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 