import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Request
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
      private usersService : UsersService,
      private jwtService : JwtService,
    ){}
    async generatejwt(id:number,email:string , userRole : string){
    const tokenPayload = {
      sub:id,
      email:email,
      role : userRole
    }
    return await this.jwtService.signAsync(tokenPayload);
  }

  async signup( @Request() req,email: string, password: string , name?: string ) {
    
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email is already in use');
    }

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
  async validate(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async signin(user:User, @Request() req) {
    const accessToken = await this.generatejwt(user.id,user.email,user.role);
    Object.assign(user,{
        accessToken
    })
    req.session.accessToken = accessToken;
    return user;
  }
}
