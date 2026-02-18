import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  healthCheck(@Res() response: Response) {
    log.info('Health check endpoint called');
    return response.status(200).json('ok');
  }

  @Get()
  getHello(@Res() response: Response) {
    return response.render('index', {
      title: 'Home',
      page_title: 'Home',
      folder: 'General',
      message: 'Welcome to the Home Page',
    });
  }

}
