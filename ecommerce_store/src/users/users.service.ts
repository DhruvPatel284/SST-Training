import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../common/dtos/create-user.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile';


@Injectable()
export class UsersService {
    constructor(
     @InjectRepository(User)
     private userRepo : Repository<User>,
    ){}

    create({name, email, password}:CreateUserDto){
        const user = this.userRepo.create({name, email, password});
        return this.userRepo.save(user);
    }
    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.userRepo.findOneBy({ id });
    }

    find(email: string) {
        return this.userRepo.find({ where: { email } });
    }

    async updateUserProfile(id:number,body:UpdateUserProfileDto){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        Object.assign(user,body);
        return await this.userRepo.save(user);
    }

    async getUserProfile(id:number){
        return await this.findOne(id);
    }
}
