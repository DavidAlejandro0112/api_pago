import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../common/entities/payment.entity';
import { User } from '../../common/entities/user.entity';
import { Card } from '../../common/entities/card.entity';
import { CreatePaymentDto } from './dto/createpayment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Card)
    private cardRepo: Repository<Card>,
    private httpService: HttpService
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    const card = await this.cardRepo.findOneBy({ id: dto.cardId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!card) throw new NotFoundException('Tarjeta no encontrada');
    let approved = false;
    try {
      const res = await firstValueFrom(
        this.httpService.post('http://localhost:8000/process-payment', {
          amount: dto.amount,
        })
      );
      approved = res.data.approved;
    } catch (e) {
      throw new BadRequestException(
        'Error al procesar el pago con el servicio externo'
      );
    }

    const payment = this.paymentRepo.create({
      amount: dto.amount,
      approved,
      user,
      card,
    });

    return this.paymentRepo.save(payment);
  }

  async getHistoryByUser(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return this.paymentRepo.find({
      where: {
        user: { id: userId },
        approved: true,
      },
      relations: ['card'],
      order: { createdAt: 'DESC' },
    });
  }
}
