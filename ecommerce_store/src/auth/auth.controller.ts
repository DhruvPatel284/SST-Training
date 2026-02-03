import {
    Request,
    Post,
    Get,
    Body,
    UseGuards,
} from '@nestjs/common'
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportAuthGuard } from '../guards/passport-auth.guard';
import { CreateUserDto } from '../common/dtos/create-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthResDto } from './dtos/auth-res.dto';
import { PassportJwtAuthGuard } from '../guards/passport-jwt-auth.guard';
import { ResponseMessage } from '../decorators/response-message.decorator';

@Controller('api/auth')
export class AuthController {
    constructor(
      private authService : AuthService,
    ){}

    @Post('/signup')
    @Serialize(AuthResDto)
    @ResponseMessage('User registered successfully')
    signup(@Request() req , @Body() body:CreateUserDto){
      return this.authService.signup(req , body.email,body.password,body.name);
    }

    @UseGuards(PassportAuthGuard)
    @Post('/signin')
    @Serialize(AuthResDto)
    @ResponseMessage('User signed in successfully')
    signin(@Request() req){
       return this.authService.signin(req.user,req);
    }

    @Get('/whoami')
    @UseGuards(PassportJwtAuthGuard)
    @ResponseMessage('User details retrieved successfully')
    whoAmI(@Request() req) {
      return req.user;
    }

    @Post('/signout')
    @ResponseMessage('Signed out successfully')
    signout(@Request() req) {
        req.session.destroy((err) => {
            if (err) {
            console.error(err);
            }
        });

        return null; // or return empty object {}
    }

}