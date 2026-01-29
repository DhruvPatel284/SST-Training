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

@Controller('orders')
@UseGuards(PassportJwtAuthGuard)
export class OrdersController {
    constructor(
        private ordersService : OrdersService 
    ){}
    
    @Post()
    @Serialize(OrderResponseDto)
    async place(@Request()req,@Body() body){
        return await this.ordersService.placeOrder(req.user.userId,body);
    }

    @Get(':id')
    @Serialize(OrderResponseDto)
    async getOrder(@Param('id') id , @Request() req){
        return await this.ordersService.getOrderByid(parseInt(id),req.user.userId);
    }

    @Get()
    @Serialize(OrderResponseDto)
    async getOrders(@Request() req){
        return await this.ordersService.getOrderHistory(req.user.userId);
    }

    @UseGuards(AdminAuthGuard)
    @Patch('status/:orderId')
    changeOrderStatus(@Param('orderId') orderId, @Body() body) {
        return this.ordersService.changeOrderStatus(orderId, body.status);
    }

}
