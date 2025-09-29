import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../common/entities/card.entity';
import { User } from '../../common/entities/user.entity';
import { CreateCardDto } from './dto/card.dto';
import { CardResponseDto } from './dto/card-response.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createCardDto: CreateCardDto): Promise<CardResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: createCardDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID "${createCardDto.userId}" no encontrado.`
      );
    }
    const existingCard = await this.cardRepository.findOneBy({
      number: createCardDto.number,
    });
    if (existingCard) {
      throw new ConflictException('El número de tarjeta ya está registrado.');
    }

    const card = this.cardRepository.create({
      number: createCardDto.number,
      holderName: createCardDto.holderName,
      user,
    });

    const savedCard = await this.cardRepository.save(card);

    return this.mapToCardResponseDto(savedCard);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: CardResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));

    const [data, total] = await this.cardRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: data.map((card) => this.mapToCardResponseDto(card)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<CardResponseDto> {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!card) {
      throw new NotFoundException(`Tarjeta con ID "${id}" no encontrada.`);
    }
    return this.mapToCardResponseDto(card);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarjeta con ID "${id}" no encontrada.`);
    }
  }
  private mapToCardResponseDto(card: Card): CardResponseDto {
    return {
      id: card.id,
      number: card.number,
      holderName: card.holderName,
      user: {
        id: card.user.id,
        name: card.user.name,
      },
    };
  }
}
