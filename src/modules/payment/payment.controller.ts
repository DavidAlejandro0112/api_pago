import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createpayment.dto';
import { Payment } from '../../common/entities/payment.entity';

@ApiTags('Payments')
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
  async getHistoryByUser(
    @Param('userId')
    userId: string
  ): Promise<Payment[]> {
    return this.paymentService.getHistoryByUser(userId);
  }
}
