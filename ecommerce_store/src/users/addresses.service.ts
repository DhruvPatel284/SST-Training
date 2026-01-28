import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { UsersService } from './users.service';
import { AddAddressDto } from './dtos/add-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';


@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private addressRepo : Repository<Address>,
        private usersService : UsersService,
    ){}

    async addUserAddress(userId:number,body:AddAddressDto){
        const { address,district,state,pincode } = body;
        if(!address || !district || !state || !pincode){
            throw new BadRequestException('Please fill all details')
        }
        const user = await this.usersService.findOne(userId);
        if(!user){
           throw new NotFoundException('User Not Found');
        }
        const addressRes = this.addressRepo.create({
            address,
            district,
            state,
            pincode,
            user
        })
        return await this.addressRepo.save(addressRes);
    }

    async updateUserAddress(id:number, userId:number, body:UpdateAddressDto){
        const user = await this.usersService.findOne(userId);
        if(!user){
           throw new NotFoundException('User Not Found');
        }
        const addressObj = await this.addressRepo.findOne({
            where : {id},
            relations : {
                user : true
            }
        })
        if(!addressObj){
            throw new NotFoundException('Address Not Found');
        }
        if(userId != addressObj.user.id){
            throw new UnauthorizedException('Only Valid User can Update the Address');
        }
        Object.assign(addressObj, body);
        return await this.addressRepo.save(addressObj);
    }
}