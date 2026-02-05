import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  Res,
  UseGuards,
  Render,
} from '@nestjs/common';
import type { Response } from 'express';
import { CartService } from '../cart.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { SkipTransform } from '../../decorators/skip-transform.decorator'
  
@Controller('cart')
@UseGuards   (PassportJwtAuthGuard)
@SkipTransform()
export class CartWebController {
  constructor(
    private cartService: CartService,
  ){}
    
  // ===== VIEW CART =====
  @Get()                         
  @Render('cart/index')
  async viewCart(@Request() req) {
    const cartItems = await this.cartService.getFullCart(
      req.user.userId,
    );

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return { cartItems, total };
  }

  // ===== ADD TO CART =====
  @Post(':productId')
  async addToCart(
    @Param('productId') productId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    await this.cartService.addToCart(
      Number(productId),
      req.user.userId,
    );
    return res.redirect('/cart');
  }

  // ===== UPDATE QUANTITY =====
  @Patch(':id')
  async updateQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number },
    @Res() res: Response,
  ) {
    await this.cartService.setQuantity(
      Number(id),
      Number(body.quantity),
    );
    return res.redirect('/cart');
  }

  // ===== REMOVE ITEM =====
  @Delete(':id')
  async removeItem(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.cartService.removeFromCart(Number(id));
    return res.redirect('/cart');
  }
}
