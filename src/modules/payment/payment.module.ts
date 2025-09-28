import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/common/entities/card.entity';
import { Payment } from 'src/common/entities/payment.entity';
import { User } from 'src/common/entities/user.entity';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Payment, Card, User])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
