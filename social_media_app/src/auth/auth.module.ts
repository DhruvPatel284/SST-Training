import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './api/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { LocalStrategy } from './api/strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { JWT_SECRET } from '../configs/config';
import { AuthWebController } from './web/auth.web.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [
    AuthController,      // API
    AuthWebController,   // WEB
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
