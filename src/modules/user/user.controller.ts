import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../common/entities/user.entity';

@ApiTags('Users')
@ApiExtraModels(User)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
  })
  @ApiBody({
    description: 'Datos del usuario a crear',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente.',
    schema: {
      $ref: getSchemaPath(User),
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Solicitud inválida: email duplicado, campos faltantes o formato incorrecto.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario.');
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Devuelve los datos de un usuario dado su UUID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID único del usuario',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado.',
    schema: {
      $ref: getSchemaPath(User),
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado con el ID proporcionado.',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user;
  }
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Devuelve una lista de todos los usuarios registrados.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(User) },
    },
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
