import {
  Controller,
  Get,
  Param,
  Request,
  Render,
  Res,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { SkipTransform } from '../decorators/skip-transform.decorator'
import { CartService } from 'src/cart/cart.service';
import { Inject, forwardRef } from '@nestjs/common';

@Controller('products')
@UseGuards(PassportJwtAuthGuard)
@SkipTransform()
export class ProductsWebController {
  constructor(
    private productsService: ProductsService,
    @Inject(forwardRef(() => CartService))
    private cartService : CartService
  ) {}

  // ===== PRODUCT LIST =====
  @Get()
  @Render('products/list')
  async list(
    @Request() req,
    @Paginate() query: PaginateQuery,
  ) {
    const result = await this.productsService.getAllProducts(
      req.user.userId,
      query,
    );

    return {
      products: result.data,
      meta: result.meta,
      links: result.links,
      query: req.query,
    };
  }

  // ===== PRODUCT DETAIL =====
  @Get(':id')
  @Render('products/detail')
  async detail(@Request() req, @Param('id') id: string) {
    const product = await this.productsService.getProductByid(
      Number(id),
      req.user.userId,
    );
    return { product };
  }

  // ===== ADD TO CART (WEB) =====
  @Post(':id/cart')
  async addToCart(
    @Request() req,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.cartService.addToCart(
      Number(id),
      req.user.userId,
    );
    return res.redirect('/cart');
  }
}
