import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../../common/entities/card.entity';
import { User } from '../../common/entities/user.entity';
import { CreateCardDto } from './dto/card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const user = await this.userRepository.findOneBy({
      id: createCardDto.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID "${createCardDto.userId}" no encontrado.`
      );
    }

    const card = this.cardRepository.create({
      number: createCardDto.number,
      holderName: createCardDto.holderName,
      user,
    });

    return this.cardRepository.save(card);
  }

  async findAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!card) {
      throw new NotFoundException(`Tarjeta con ID "${id}" no encontrada.`);
    }
    return card;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarjeta con ID "${id}" no encontrada.`);
    }
  }
}
