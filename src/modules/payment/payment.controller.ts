import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createpayment.dto';
import { Payment } from '../../common/entities/payment.entity';
import { AuthGuard } from '@nestjs/passport';

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
  async getHistoryByUser(
    @Param('userId')
    userId: string
  ): Promise<Payment[]> {
    return this.paymentService.getHistoryByUser(userId);
  }
}
