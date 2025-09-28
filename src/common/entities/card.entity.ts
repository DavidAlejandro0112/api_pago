import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 16 })
  number: string;

  @Column({ length: 100 })
  holderName: string;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.card)
  payments: Payment[];
}
