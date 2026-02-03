import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from '../users.service';
import { AddressesService } from '../addresses.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { UpdateUserProfileDto } from '../dtos/update-user-profile';
import { AddAddressDto } from '../dtos/add-address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';
import { SkipTransform } from '../../decorators/skip-transform.decorator'

@Controller('profile')
@SkipTransform()
@UseGuards(PassportJwtAuthGuard)
export class UsersWebController {
  constructor(
    private usersService: UsersService,
    private addressesService: AddressesService,
  ) {}

  // ===== PROFILE PAGE =====
  @Get()
  @Render('users/profile')
  async profile(@Request() req) {
    const user = await this.usersService.getUserProfile(req.user.userId);
    return { user };
  }

  // ===== UPDATE PROFILE =====
  @Patch()
  async updateProfile(
    @Request() req,
    @Body() body: UpdateUserProfileDto,
    @Res() res: Response,
  ) {
    await this.usersService.updateUserProfile(req.user.userId, body);
    return res.redirect('/profile');
  }

  // ===== LIST ADDRESSES =====
  @Get('addresses')
  @Render('users/addresses/list')
  async listAddresses(@Request() req) {
    const addresses = await this.addressesService.getAllUserAddresses(
      req.user.userId,
    );
    return { addresses };
  }

  // ===== ADD ADDRESS PAGE =====
  @Get('addresses/new')
  @Render('users/addresses/create')
  addAddressPage() {
    return {};
  }

  // ===== ADD ADDRESS =====
  @Post('addresses')
  async addAddress(
    @Request() req,
    @Body() body: AddAddressDto,
    @Res() res: Response,
  ) {
    await this.addressesService.addUserAddress(
      req.user.userId,
      body,
    );
    return res.redirect('/profile/addresses');
  }

  // ===== EDIT ADDRESS PAGE =====
  @Get('addresses/:id/edit')
  @Render('users/addresses/edit')
  async editAddressPage(
    @Request() req,
    @Param('id') id: string,
  ) {
    const address = await this.addressesService.getAddressByid(
      Number(id),
      req.user.userId,
    );
    return { address };
  }

  // ===== UPDATE ADDRESS =====
  @Patch('addresses/:id')
  async updateAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateAddressDto,
    @Res() res: Response,
  ) {
    await this.addressesService.updateUserAddress(
      Number(id),
      req.user.userId,
      body,
    );
    return res.redirect('/profile/addresses');
  }
}
