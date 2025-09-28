import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Card } from './card.entity';
import { Payment } from './payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  password: string;

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
