import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET } from '../../../configs/config';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1️⃣ For API / Mobile
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // 2️⃣ For Web (EJS)
        (req) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Please sign in');
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
