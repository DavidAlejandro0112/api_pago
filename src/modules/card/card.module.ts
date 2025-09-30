import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/common/entities/card.entity';
import { User } from 'src/common/entities/user.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User]), AuthModule],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
