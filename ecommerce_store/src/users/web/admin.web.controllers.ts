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
  Render,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { SkipTransform } from '../../decorators/skip-transform.decorator';
import { ProductsService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { AddProductDto } from 'src/products/dtos/add-product.dto';
import { OrderStatus } from 'src/orders/order.entity';

@Controller('admin')
@SkipTransform()
@UseGuards(PassportJwtAuthGuard, AdminAuthGuard)
export class AdminWebController {
  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  // ===== ADMIN DASHBOARD =====
  @Get()
  @Render('admin/dashboard')
  async dashboard() {
    const products = await this.productsService.getAllProductsForAdmin();
    const orders = await this.ordersService.getAllOrders();
    
    const stats = {
      totalProducts: products.length,
      lowStockProducts: products.filter(p => p.stock < 10).length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };

    return { stats };
  }
  // ===== PRODUCTS MANAGEMENT =====
  @Get('products')
  @Render('admin/products')
  async products() {
    const products = await this.productsService.getAllProductsForAdmin();
    return { products };
  }

  @Get('products/new')
  @Render('admin/products-form')
  newProduct() {
    return { product: null, isEdit: false };
  }

  @Post('products')
  async createProduct(
    @Body() body: AddProductDto,
    @Res() res: Response,
  ) {
    await this.productsService.addProduct(body);
    return res.redirect('/admin/products');
  }

  @Get('products/:id/edit')
  @Render('admin/products-form')
  async editProduct(@Param('id') id: string) {
    const product = await this.productsService.getProduct(Number(id));
    return { product, isEdit: true };
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: Partial<AddProductDto>,
    @Res() res: Response,
  ) {
    await this.productsService.updateProduct(Number(id), body);
    return res.redirect('/admin/products');
  }

  @Delete('products/:id')
  async deleteProduct(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.productsService.deleteProduct(Number(id));
    return res.redirect('/admin/products');
  }

  // ===== ORDERS MANAGEMENT =====
  @Get('orders')
  @Render('admin/orders')
  async orders() {
    const orders = await this.ordersService.getAllOrders();
    return { orders };
  }

  @Get('orders/:id')
  @Render('admin/order-detail')
  async orderDetail(@Param('id') id: string) {
    const order = await this.ordersService.getOrderByIdAdmin(Number(id));
    return { order };
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
    @Res() res: Response,
  ) {
    await this.ordersService.changeOrderStatus(Number(id), body.status);
    return res.redirect(`/admin/orders/${id}`);
  }
}