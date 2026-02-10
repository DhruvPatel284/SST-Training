import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcryptjs from 'bcryptjs';
import admin from 'firebase-admin';

import { OauthAccessTokenService } from '../oauth-access-token/oauth-access-token.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dtos/request/change-password.dto';
import { LoginDto } from './dtos/request/login.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private accessTokenService: OauthAccessTokenService,
    private jwtService : JwtService,
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
  async generatejwt(id:string,email:string , userRole : string){
    const tokenPayload = {
      sub:id,
      email:email,
      role : userRole
    }
    return await this.jwtService.signAsync(tokenPayload);
  }

  async signup(@Request() req,email: string, password: string , name?: string ) {
    
    // const users = await this.usersService.findOneByEmail(email);
    // if (users) {
    //   throw new BadRequestException('email is already in use');
    // }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({name,email, password:result});
    const accessToken = await this.generatejwt(user.id,user.email,user.role);
    Object.assign(user,{
        accessToken
    })
    req.session.accessToken = accessToken;
    return user;
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
