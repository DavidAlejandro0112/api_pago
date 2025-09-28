import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { envs } from './config';
import { User } from './common/entities/user.entity';
import { Payment } from './common/entities/payment.entity';
import { Card } from './common/entities/card.entity';
import { CardModule } from './modules/card/card.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: envs.db.type as 'postgres',
      host: envs.db.host,
      port: envs.db.port,
      username: envs.db.user,
      password: envs.db.password,
      database: envs.db.name,
      // autoLoadEntities: true,
      entities: [User, Payment, Card],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CardModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
