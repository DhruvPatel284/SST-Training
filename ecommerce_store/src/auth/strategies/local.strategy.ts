import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'my-local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // login with email instead of username
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validate(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user; // attached to req.user
  }
}
