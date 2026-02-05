import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  Res,
  Render,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from '../orders.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { CartService } from 'src/cart/cart.service';
import { SkipTransform } from '../../decorators/skip-transform.decorator'
import { AddressesService } from 'src/users/addresses.service';
import { Cart } from 'src/cart/cart.entity';

@Controller('orders')
@SkipTransform()
@UseGuards(PassportJwtAuthGuard)
export class OrdersWebController {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private cartService: CartService,
    private addressesService : AddressesService
  ) {}

  // ===== ORDER HISTORY =====
  @Get()
  @Render('orders/list')
  async list(@Request() req) {
    const orders = await this.ordersService.getOrderHistory(
      req.user.userId,
    );
    return { orders };
  }


  // ===== CHECKOUT PAGE =====
    @Get('checkout')
    @Render('orders/checkout')
    async checkout(@Request() req,@Query('cartItemId') cartItemId:string) {
        //const { cartItemId } = req.query;
        //console.log(cartItemId)

         let cartItems: Cart[] = [];
        let singleItem = false;

        if (parseInt(cartItemId)) {
            // 🔹 Single item checkout
            const item = await this.cartService.findCartItemByid(
             Number(cartItemId),
            );
            if(!item){
                throw new NotFoundException('Not Found Item')
            }

            // security check
            if (item.user.id !== req.user.userId) {
            throw new Error('Unauthorized');
            }

            cartItems = [item];
            singleItem = true;
        } else {
            // 🔹 Full cart checkout
            cartItems = await this.cartService.getFullCart(
                req.user.userId,
            );
        }

        const addresses =
            await this.addressesService.getAllUserAddresses(
            req.user.userId,
            );

        const total = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        );

        return {
            cartItems,
            addresses,
            total,
            singleItem,
            cartItemId: cartItemId || null,
        };
    }


    @Post()
    async placeOrder(
        @Request() req,
        @Body() body,
        @Res() res: Response,
    ) {
        const payload = {
            singleItem: body.singleItem === 'true',
            cartItemId: body.cartItemId
            ? Number(body.cartItemId)
            : undefined,
            addressId: Number(body.addressId),
        };

        await this.ordersService.placeOrder(
            req.user.userId,
            payload,
        );

        return res.redirect('/orders');
    }



  // ===== ORDER DETAIL =====
  @Get(':id')
  @Render('orders/detail')
  async detail(
    @Request() req,
    @Param('id') id: string,
  ) {
    const order = await this.ordersService.getOrderByid(
      Number(id),
      req.user.userId,
    );
    return { order };
  }
}
