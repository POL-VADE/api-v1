import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SourceType {
  Bank = 'Bank',
  Custom = 'Custom'
}

@Entity('zt_source')
export class Source {
  @PrimaryColumn('uuid', { name: 'source_id' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: SourceType
  })
  type: SourceType;

  @Column('decimal', { name: 'initial_balance', precision: 10, scale: 2 })
  initialBalance: number;

  @Column({ name: 'bank_source_title', nullable: true })
  bankSourceTitle: string;

  @Column({ name: 'bank_source_bank_name', nullable: true })
  bankSourceBankName: string;

  @Column({ name: 'bank_source_card_number', nullable: true })
  bankSourceCardNumber: string;

  @Column({ name: 'bank_source_sms_suggestion', default: false })
  bankSourceSmsSuggestion: boolean;

  @Column({ name: 'custom_source_title', nullable: true })
  customSourceTitle: string;

  @Column()
  iconRes: string;

  @Column()
  iconColor: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 