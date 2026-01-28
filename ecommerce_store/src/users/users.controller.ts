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

@Controller('users')
@UseGuards(PassportJwtAuthGuard)
export class UsersController {
    constructor(
        private usersService : UsersService,
        private addressesService : AddressesService,
    ){}

    @Post('address')
    @Serialize(AddressResponseDto)
    async addAddress(@Request() req ,@Body() body ){
        return await this.addressesService.addUserAddress(req.user.userId,body);
    }

    @Patch('address/:id')
    @Serialize(AddressResponseDto)
    async updateAddress(@Param('id') id,@Request() req ,@Body() body){
        return await this.addressesService.updateUserAddress(parseInt(id),req.user.userId,body)
    }

    @Get('address/:id')
    @Serialize(AddressResponseDto)
    async getAddress(@Param('id') id,@Request() req){
        return await this.addressesService.getAddressByid(parseInt(id),req.user.userId);
    }
    
    @Get('address')
    @Serialize(AddressResponseDto)
    async getAllAddress(@Request() req){
        return await this.addressesService.getAllUserAddresses(req.user.userId);
    }
}
