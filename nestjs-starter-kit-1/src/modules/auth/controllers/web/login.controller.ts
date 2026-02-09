import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { UserRole } from 'src/modules/users/user.entity';

import { AuthGuard } from '../../../../common/guards/auth.guard';
import { AuthService } from '../../auth.service';
import { LoginWebDto } from '../../dtos/request/login-web.dto';

@Controller()
export class LoginController {
  constructor(private authService: AuthService) {}
  @Get('login')
  loadLoginView(@Session() session, @Res() res: Response, @Req() req: Request) {
    if (session.userId) {
      return res.redirect('/');
    }
    return res.render('pages/auth/login', {
      title: 'Login',
      page_title: 'Login',
      folder: 'Authentication',
      layout: 'layouts/layout-without-nav',
    });
  }

  @Post('login')
  async login(
    @Body() body: LoginWebDto,
    @Session() session: Record<string, any>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (session.userId) {
      return res.redirect('/');
    }

    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      console.log(user)

      if (user && user.role === UserRole.Admin) {
        session.userId = user.id;
        req.flash('toast', {
          message: { type: 'success', message: 'Login Successful' },
        });
        return res.redirect('/');
      } else {
        throw new ForbiddenException('You do not have access to Admin portal');
      }
    } catch (error) {
      console.log(error);
      req.flash('oldInputs', body);
      req.flash('errors', 'Invalid email or password');
    }

    return res.redirect('/login');
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Session() session: any, @Res() res: Response, @Req() req: Request) {
    session.userId = null;
    req.flash('toast', {
      type: 'success',
      message: 'Logout Successful',
    });
    return res.redirect('/login');
  }
}
