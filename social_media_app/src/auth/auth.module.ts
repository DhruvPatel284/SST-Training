import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_SECRET } from '../configs/config';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET ,
      signOptions: { expiresIn: '2d' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
