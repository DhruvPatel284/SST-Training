import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../api/auth.service';
import { PassportAuthGuard } from '../../guards/passport-auth.guard';

@Controller()
export class AuthWebController {
  constructor(private authService: AuthService) {}

  // ===== LOGIN PAGE =====
  @Get('/login')
  @Render('auth/login')
  loginPage() {
    return {};
  }

  // ===== SIGNUP PAGE =====
  @Get('/signup')
  @Render('auth/signup')
  signupPage() {
    return {};
  }

  // ===== HANDLE SIGNUP =====
  @Post('/signup')
  async signup(
    @Body() body: { name?: string; email: string; password: string },
    @Res() res: Response,
  ) {
    const user:any = await this.authService.signup(
      body.email,
      body.password,
      body?.name,
    );
  
    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
    });

    return res.redirect('/posts');
  }

  // ===== HANDLE LOGIN =====
  @UseGuards(PassportAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    const user:any = await this.authService.signin(req.user);

    res.cookie('access_token', user.accessToken, {
      httpOnly: true,
    });
    return res.redirect('/posts');
  }

  // ===== LOGOUT =====
  @Get('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.redirect('/login');
  }
}
