import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';


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
}
