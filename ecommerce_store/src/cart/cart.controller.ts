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


@Controller('cart')
@UseGuards(PassportJwtAuthGuard)
export class CartController {
    constructor(
        private cartService : CartService,
    ){}

    @Post(':productId')
    async add(@Param('productId') productId , @Request() req) {
        return await this.cartService.addToCart(parseInt(productId),req.user.userId);
    }

    @Delete(':id')
    async remove(@Param('id') id) {
        return await this.cartService.removeFromCart(parseInt(id));
    }

    @Put(':id')
    async quantity(@Param('id') id , @Body() body) {
        return await this.cartService.setQuantity(parseInt(id),body.quantity);
    }

    @Get()
    async get(@Request() req) {
        return await this.cartService.getFullCart(req.user.userId);
    }

}
