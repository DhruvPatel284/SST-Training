import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { SkipTransform } from 'src/decorators/skip-transform.decorator';

@Controller('auth')
@SkipTransform()
export class AuthPageController {
  constructor(private authService: AuthService) {}

  // ===== Login Page =====
  @Get('login')
  @Render('auth/login')
  loginPage() {
    return { title: 'Login', error: null };
  }

  // ===== Handle Login =====
  @Post('login')
  async login(
    @Body() body,
    @Req() req,
    @Res() res,
  ) {
    try {
      const user = await this.authService.validate(
        body.email,
        body.password,
      );
      await this.authService.signin(user, req);
      return res.redirect('/products');
    } catch (err) {
      return res.render('auth/login', {
        title: 'Login',
        error: err.message || 'Login failed',
      });
    }
  }

  // ===== Register Page =====
  @Get('register')
  @Render('auth/register')
  registerPage() {
    return { title: 'Register', error: null };
  }

  // ===== Handle Register =====
  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      await this.authService.signup(
        req,
        body.email,
        body.password,
        body.name,
      );
      return res.redirect('/products');
    } catch (err) {
      return res.render('auth/register', {
        title: 'Register',
        error: err.message || 'Registration failed',
      });
    }
  }

  // ===== Logout =====
  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
}
