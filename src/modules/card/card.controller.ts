import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Query,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/card.dto';
import { Card } from '../../common/entities/card.entity';
import { AuthGuard } from '@nestjs/passport';
import { CardResponseDto } from './dto/card-response.dto';

@ApiTags('Cards')
@ApiBearerAuth()
@ApiExtraModels(Card)
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({})
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      $ref: getSchemaPath(Card),
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  async create(@Body() createCardDto: CreateCardDto): Promise<CardResponseDto> {
    try {
      return await this.cardService.create(createCardDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Error interno al crear la tarjeta.');
    }
  }
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.cardService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una tarjeta por ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(Card),
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async findOne(@Param('id') id: string): Promise<CardResponseDto> {
    const card = await this.cardService.findOne(id);
    if (!card) {
      throw new NotFoundException(`Tarjeta con ID "${id}" no encontrada.`);
    }
    return card;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarjeta por ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UUID de la tarjeta a eliminar',
    type: String,
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.cardService.remove(id);
      return { message: 'Tarjeta eliminada correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al intentar eliminar la tarjeta.');
    }
  }
}
