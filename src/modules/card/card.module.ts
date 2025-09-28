import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/common/entities/card.entity';
import { User } from 'src/common/entities/user.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
