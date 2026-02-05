import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_SECRET } from '../configs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthPageController } from './web/auth-web.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET ,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController,AuthPageController],
  providers: [AuthService,LocalStrategy,JwtStrategy]
})
export class AuthModule {}