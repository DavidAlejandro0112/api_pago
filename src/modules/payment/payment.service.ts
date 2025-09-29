import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../common/entities/payment.entity';
import { User } from '../../common/entities/user.entity';
import { Card } from '../../common/entities/card.entity';
import { CreatePaymentDto } from './dto/createpayment.dto';
import { PaginationDTO } from '../../common/dto/pagination.dto'; // 👈

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

  async getHistoryByUser(
    userId: string,
    pagination: PaginationDTO
  ): Promise<{
    data: Payment[];
    totalItems: number;
    currentPage: number;
    Limit: number;
    totalPages: number;
  }> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    try {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 10;
      const safeLimit = Math.min(limit, 100);
      const safePage = Math.max(1, page);

      const [data, totalItems] = await this.paymentRepo.findAndCount({
        where: {
          user: { id: userId },
          approved: true,
        },
        relations: ['card'],
        order: { createdAt: 'DESC' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      });

      const totalPages = Math.ceil(totalItems / safeLimit);

      return {
        data,
        totalItems,
        currentPage: safePage,
        Limit: safeLimit,
        totalPages,
      };
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
      throw new InternalServerErrorException(
        'No se pudo recuperar el historial de pagos. Inténtelo más tarde.'
      );
    }
  }
}
