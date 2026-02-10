import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { AuthGuard } from '../../../../common/guards/auth.guard';
import { OrderStatus } from '../../order.entity';
import { OrdersService } from '../../orders.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersWebController {
  constructor(private ordersService: OrdersService) {}

  // ─── List all orders ───────────────────────────────────────────────
  @Get()
  async getOrderList(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const isAjax =
      request.xhr ||
      request.headers['accept']?.includes('application/json') ||
      request.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      const result = await this.ordersService.getOrdersPaginate(query);
      return res.json(result);
    }

    return res.render('pages/order/index', {
      title: 'Order List',
      page_title: 'Order Management',
      folder: 'Order',
    });
  }

  // ─── Orders filtered by user (used from user show page) ────────────
  @Get('/user/:userId')
  async getOrdersByUser(
    @Param('userId') userId: string,
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const isAjax =
      request.xhr ||
      request.headers['accept']?.includes('application/json') ||
      request.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      const result = await this.ordersService.getOrdersByUser(userId, query);
      return res.json(result);
    }

    return res.render('pages/order/index', {
      title: 'User Orders',
      page_title: 'User Order History',
      folder: 'Order',
      userId,
    });
  }

  // ─── Order detail ──────────────────────────────────────────────────
  @Get('/:id')
  async getOrderById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.findOne(id);

    if (!order) return res.redirect('/orders');

    const nextStatuses = this.ordersService.getNextStatuses(order.status);

    return res.render('pages/order/show', {
      title: 'Order Detail',
      page_title: 'Order Information',
      folder: 'Order',
      order,
      nextStatuses,
      OrderStatus,
      successMessage: req.flash('success')[0] || null,
      errorMessage:   req.flash('error')[0]   || null,
    });
  }

  // ─── Update order status ───────────────────────────────────────────
  @Post('/:id/status')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() body: { status: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const validStatuses = Object.values(OrderStatus);

    if (!body.status || !validStatuses.includes(body.status as OrderStatus)) {
      req.flash('error', 'Invalid order status');
      return res.redirect(`/orders/${id}`);
    }

    const order = await this.ordersService.findOne(id);
    const allowedNext = this.ordersService.getNextStatuses(order.status);

    if (!allowedNext.includes(body.status as OrderStatus)) {
      req.flash(
        'error',
        `Cannot change status from "${order.status}" to "${body.status}"`,
      );
      return res.redirect(`/orders/${id}`);
    }

    await this.ordersService.updateStatus(id, body.status as OrderStatus);
    req.flash('success', `Order status updated to "${body.status}"`);
    return res.redirect(`/orders/${id}`);
  }
}