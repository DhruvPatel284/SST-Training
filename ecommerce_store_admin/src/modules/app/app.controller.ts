import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppService } from './app.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  @Get('health-check')
  healthCheck(@Res() response: Response) {
    log.info('Health check endpoint called');
    return response.status(200).json('ok');
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // getHello(@Res() response: Response) {
  //   return response.render('index', {
  //     title: 'Home',
  //     page_title: 'Home',
  //     folder: 'General',
  //     message: 'Welcome to the Home Page',
  //   });
  // }
  @Get('/')
  @UseGuards(AuthGuard)
  async dashboard(@Req() req: Request, @Res() res: Response) {
    try {
      // Get counts
      const [users, products, orders] = await Promise.all([
        this.usersService.findAll(),
        this.productsService.findAll(),
        this.ordersService.findAll(),
      ]);

      const analytics = {
        usersCount: users.length,
        productsCount: products.length,
        ordersCount: orders.length,
      };

      return res.render('index', {
        title: 'Dashboard',
        page_title: 'Dashboard',
        folder: 'Dashboard',
        analytics,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.render('pages/dashboard/index', {
        title: 'Dashboard',
        page_title: 'Dashboard',
        folder: 'Dashboard',
        analytics: {
          usersCount: 0,
          productsCount: 0,
          ordersCount: 0,
        },
      });
    }
  }
}
