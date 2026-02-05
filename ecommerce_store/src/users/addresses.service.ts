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
        const addressObj = await this.getAddress(id,userId);
        Object.assign(addressObj, body);
        return await this.addressRepo.save(addressObj);
    }

    async getAddressByid(id:number , userId:number) {
        return await this.getAddress(id,userId);
    }

    async getAllUserAddresses(userId:number){
        return await this.addressRepo.find({
            where:{
                user :{
                    id:userId
                }
            },
        }) 
    }

    async getAddress(id:number , userId:number) {
        const user = await this.usersService.findOne(userId);
        if(!user){
           throw new NotFoundException('User Not Found');
        }
        const addressObj = await this.addressRepo.findOne({
            where : {id},
            relations : {
                user : true,
                orders : true
            }
        })
        if(!addressObj){
            throw new NotFoundException('Address Not Found');
        }
        if(userId != addressObj.user.id){
            throw new UnauthorizedException('Only Valid User can Access the Address');
        }
        return addressObj;
    }

    async deleteUserAddress(id: number, userId: number) {
        const address = await this.getAddress(id, userId);

        // Optional safety: block delete if used in orders
        if (address.orders && address.orders.length > 0) {
            throw new BadRequestException(
            'Address is already used in orders and cannot be deleted',
            );
        }

        await this.addressRepo.remove(address);
        return address;
    }

}