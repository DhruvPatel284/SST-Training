import { Strategy , ExtractJwt } from 'passport-jwt';
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { JWT_SECRET } from '../../configs/config';
import { UnauthorizedException } from '@nestjs/common';


export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(private authService:AuthService){
        console.log(`jwt : ${JWT_SECRET}`)
        super({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }
    async validate(payload: {sub : number , email : string}){
        if (!payload?.sub) {
            throw new UnauthorizedException('Please Sign In');
        }
        return {userId : payload.sub , email : payload.email};
    }
}