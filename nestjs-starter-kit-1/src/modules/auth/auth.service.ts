import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcryptjs from 'bcryptjs';
import admin from 'firebase-admin';

import { OauthAccessTokenService } from '../oauth-access-token/oauth-access-token.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dtos/request/change-password.dto';
import { LoginDto } from './dtos/request/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private accessTokenService: OauthAccessTokenService,
  ) {
    // Uncomment on use
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert({
    //       clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    //       projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    //       privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY'),
    //     }),
    //   });
    // }
  }

  async login(input: LoginDto) {
    const firebaseUser = await admin.auth().verifyIdToken(input.firebaseToken);

    // if (!firebaseUser) throw new NotFoundException('Invalid Credentials.');

    const user = await this.usersService.findOneOrCreateByFirebaseUid(
      firebaseUser.uid,
    );
    if (!user) throw new UnauthorizedException('Invalid Credentials!');

    const accessToken = await this.accessTokenService.generateJwtToken(user);

    const userWithToken: User & { accessToken: string } = {
      ...user,
      accessToken,
    };

    return userWithToken;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    // const matches = await bcryptjs.compare(password, user.password);
    // if (!matches) return null;
    return user;
  }

  async logout(headers: any) {
    if (!headers.authorization)
      throw new BadRequestException('No Authorization Found in Headers');
    const token = headers.authorization.split(' ')[1];
    await this.accessTokenService.revokeAccessToken(token);
    return { message: 'Logout' };
  }

  async validatePassword(
    user: User,
    password: string,
    newPassword: string | null = null,
  ) {
    /*
    This method returns hashed newPassword when passed else hashed of password 
    */
    const matches = await bcryptjs.compare(password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Password is invalid !!!');
    }
    if (newPassword) {
      const newHash = await bcryptjs.hash(newPassword, 10);
      return newHash;
    }
    return user.password;
  }

  async removeUser(userId: string) {
    await this.usersService.remove(userId);

    return { message: 'User Successfully Removed!!!' };
  }

  async changePassword(user: User | string, body: ChangePasswordDto) {
    const { currentPassword, confirmPassword } = body;
    if (currentPassword === confirmPassword) {
      throw new BadRequestException('Current & New Passwords cannot be same.');
    }
    if (typeof user === 'string') {
      user = await this.usersService.findOne(user);
    }
    const password = await this.validatePassword(
      user,
      currentPassword,
      confirmPassword,
    );

    await this.usersService.resetPassword(user, password);
    return { message: 'Password Changed Successfully!!!' };
  }
}
