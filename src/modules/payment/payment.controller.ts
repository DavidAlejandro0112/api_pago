import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createpayment.dto';
import { Payment } from '../../common/entities/payment.entity';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiExtraModels(Payment)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiCreatedResponse({
    type: Payment,
  })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Obtener historial de pagos de un usuario' })
  @ApiOkResponse({
    description: 'Lista de pagos del usuario.',
    type: [Payment],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de pagos por página (por defecto: 10, máximo: 100)',
    example: 10,
  })
  async getHistoryByUser(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDTO
  ) {
    return this.paymentService.getHistoryByUser(userId, pagination);
  }
}
