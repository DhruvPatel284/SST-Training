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

@Controller('orders')
@UseGuards(PassportJwtAuthGuard)
export class OrdersController {
    constructor(
        private ordersService : OrdersService 
    ){}
    @Post()
    async place(@Request()req,@Body() body){
        return await this.ordersService.placeOrder(req.user.userId,body);
    }
}
