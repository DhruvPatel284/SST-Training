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
import { CartService } from './cart.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CartItemResponseDto } from 'src/common/dtos/cart-res.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';


@Controller('api/cart')
@UseGuards(PassportJwtAuthGuard)
@Serialize(CartItemResponseDto)
export class CartController {
    constructor(
        private cartService : CartService,
    ){}

    @Post(':productId')
    @ResponseMessage('Product Added Successfully')
    async add(@Param('productId') productId , @Request() req) {
        return await this.cartService.addToCart(parseInt(productId),req.user.userId);
    }

    @Delete(':id')
    @ResponseMessage('Product Removed Successfully')
    async remove(@Param('id') id) {
        return await this.cartService.removeFromCart(parseInt(id));
    }

    @Put(':id')
    @ResponseMessage('Quantity Updated Successfully')
    async quantity(@Param('id') id , @Body() body) {
        return await this.cartService.setQuantity(parseInt(id),body.quantity);
    }

    @Get()
    @ResponseMessage('Cart Products Retrivied Successfully')
    async get(@Request() req) {
        return await this.cartService.getFullCart(req.user.userId);
    }

}
