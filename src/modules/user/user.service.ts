import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDTO } from '../../common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    try {
      const existingUser = await this.userRepository.findOneBy({ email });
      if (existingUser) {
        throw new ConflictException(
          'El correo electrónico ya está registrado.'
        );
      }

      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException(
        'No se pudo crear el usuario. Inténtelo más tarde.'
      );
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(
        `Usuario con email "${email}" no encontrado.`
      );
    }
    return user;
  }

  async findAll(pagination: PaginationDTO): Promise<{
    data: User[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    try {
      const safeLimit = Math.min(limit, 100);
      const safePage = Math.max(1, page);

      const [data, totalItems] = await this.userRepository.findAndCount({
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      });

      const totalPages = Math.ceil(totalItems / safeLimit);

      return {
        data,
        totalItems,
        currentPage: safePage,
        itemsPerPage: safeLimit,
        totalPages,
      };
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw new InternalServerErrorException(
        'No se pudieron recuperar los usuarios. Inténtelo más tarde.'
      );
    }
  }
}
