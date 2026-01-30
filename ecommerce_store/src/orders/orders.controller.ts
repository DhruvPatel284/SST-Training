import { 
    Controller, 
    UseGuards,
    Request,
    Body,
    Get, 
    Post,
    Patch,
    Put,
    Delete,
    Param
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { OrderStatus } from './order.entity';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { OrderResponseDto } from 'src/common/dtos/order-res.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';

@Controller('orders')
@UseGuards(PassportJwtAuthGuard)
export class OrdersController {
    constructor(
        private ordersService : OrdersService 
    ){}
    
    @Post()
    @ResponseMessage('Order Placed Successfully')
    @Serialize(OrderResponseDto)
    async place(@Request()req,@Body() body){
        return await this.ordersService.placeOrder(req.user.userId,body);
    }

    @Get(':id')
    @ResponseMessage('Order Retrivied Successfully')
    @Serialize(OrderResponseDto)
    async getOrder(@Param('id') id , @Request() req){
        return await this.ordersService.getOrderByid(parseInt(id),req.user.userId);
    }

    @Get()
    @ResponseMessage('Orders Retrivied Successfully')
    @Serialize(OrderResponseDto)
    async getOrders(@Request() req){
        return await this.ordersService.getOrderHistory(req.user.userId);
    }

    @UseGuards(AdminAuthGuard)
    @Patch('status/:orderId')
    @ResponseMessage('Order Status Changed Successfully')
    changeOrderStatus(@Param('orderId') orderId, @Body() body) {
        return this.ordersService.changeOrderStatus(orderId, body.status);
    }

}
