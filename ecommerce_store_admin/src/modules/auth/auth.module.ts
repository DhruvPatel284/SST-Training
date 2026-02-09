import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { OauthAccessTokenModule } from '../oauth-access-token/oauth-access-token.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthApiController } from './controllers/api/auth-api.controller';
import { AuthWebController } from './controllers/web/auth.controller';
import { LoginController } from './controllers/web/login.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthWebController, AuthApiController, LoginController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [ConfigModule, UsersModule, PassportModule, OauthAccessTokenModule],
})
export class AuthModule {}
