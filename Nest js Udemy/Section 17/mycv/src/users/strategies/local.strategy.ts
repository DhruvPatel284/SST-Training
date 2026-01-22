import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'my-local'){
    constructor(private authService:AuthService){
        super({ usernameField: 'email' });
    }
    async validate(email:string , password:string): Promise<any> {
        const user = await this.authService.validate(email,password);
        console.log(`inside local strategy : ${user.id}`)
        if(!user){
            throw new UnauthorizedException('user is not valid');
        }
        return user;
    }

}