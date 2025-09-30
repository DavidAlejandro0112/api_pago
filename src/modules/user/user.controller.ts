import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../common/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDTO } from '../../common/dto/pagination.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(User, PaginationDTO)
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
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario.');
    }
  }

  @UseGuards(AuthGuard('jwt'))
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
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios con paginación',
    description:
      'Devuelve una lista paginada de todos los usuarios registrados.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  async findAll(@Query() pagination: PaginationDTO): Promise<{
    data: UserResponseDto[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  }> {
    return await this.userService.findAll(pagination);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    await this.userService.changePassword(id, changePasswordDto);
    return { message: 'Contraseña actualizada correctamente.' };
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
