import { 
    Controller, 
    UseGuards,
    Request,
    Body,
    Get, 
    Post,
    Patch, 
    Param
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AddressResponseDto } from 'src/common/dtos/address-res.dto';
import { UserResponseDto } from 'src/common/dtos/user-res.dto';
import { ResponseMessage } from '../decorators/response-message.decorator';

@Controller('api/users')
@UseGuards(PassportJwtAuthGuard)
export class UsersController {
    constructor(
        private usersService : UsersService,
        private addressesService : AddressesService,
    ){}

    @Patch('profile')
    @ResponseMessage('Profile Updated Successfully')
    @Serialize(UserResponseDto)
    async updateUser(@Request() req ,@Body() body){
        return await this.usersService.updateUserProfile(req.user.userId,body);
    }

    @Get('profile')
    @ResponseMessage('Profile Retrivied Successfully')
    @Serialize(UserResponseDto)
    async getUser(@Request() req){
        return await this.usersService.getUserProfile(req.user.userId);
    }

    @Post('address')
    @ResponseMessage('Address Added Successfully')
    @Serialize(AddressResponseDto)
    async addAddress(@Request() req ,@Body() body ){
        return await this.addressesService.addUserAddress(req.user.userId,body);
    }

    @Patch('address/:id')
    @ResponseMessage('Address Updated Successfully')
    @Serialize(AddressResponseDto)
    async updateAddress(@Param('id') id,@Request() req ,@Body() body){
        return await this.addressesService.updateUserAddress(parseInt(id),req.user.userId,body)
    }

    @Get('address/:id')
    @ResponseMessage('Address Retrivied Successfully')
    @Serialize(AddressResponseDto)
    async getAddress(@Param('id') id,@Request() req){
        return await this.addressesService.getAddressByid(parseInt(id),req.user.userId);
    }
    
    @Get('address')
    @Serialize(AddressResponseDto)
    @ResponseMessage('Addresses Retrivied Successfully')
    async getAllAddress(@Request() req){
        return await this.addressesService.getAllUserAddresses(req.user.userId);
    }
}
