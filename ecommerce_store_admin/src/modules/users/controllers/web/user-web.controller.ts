import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { AuthGuard } from '../../../../common/guards/auth.guard';
import { UpdateUserDto } from '../../dtos/request/update-user.dto';
import { UserDto } from '../../dtos/response/user.dto';
import { UsersService } from '../../users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersWebController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUserList(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const isAjax =
      request.xhr ||
      request.headers['accept']?.includes('application/json') ||
      request.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      const result = await this.usersService.getUsersPaginate(query);
      // make sure to do serialize the data before sending it
      return res.json(result);
    }

    return res.render('pages/user/index', {
      title: 'User List',
      page_title: 'User DataTable',
      folder: 'User',
    });
  }

  @Get('/create')
  createUserView(@Req() req: Request, @Res() res: Response) {
    return res.render('pages/user/create', {
      title: 'Create User',
      page_title: 'Create User',
      folder: 'User',
      errors: {},
      old: null,
    });
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(id);

    if (!user) return res.redirect('/users');

    return res.render('pages/user/show', {
      title: 'User Detail',
      page_title: 'User Detail',
      folder: 'User',
      user: plainToInstance(UserDto, user),
    });
  }

  @Get('/:id/edit')
  async editUserById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    console.log('edit user ', user);
    console.log('flash errors ', req.flash('errors'));
    console.log('flash old ', req.flash('old'));

    return res.render('pages/user/edit', {
      title: 'Edit User',
      page_title: 'Edit User',
      folder: 'User',
      user: plainToInstance(UserDto, user),

      errors: req.flash('errors')[0] || {},

      old: req.flash('old')[0] || null,
    });
  }

  @Put('/:id/update')
  async updateUserById(
    @Param('id') id: string,
    @Body()
    body: {
      name: string | undefined;
      email: string | undefined;
      phoneNumber: string | undefined;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const errors: Array<object> = [];
      if (body.name === '') {
        errors.push({ name: 'Name should not be empty' });
      }
      if (body.email === '') {
        errors.push({ email: 'Email should not be empty' });
      }
      if (body.phoneNumber === '') {
        errors.push({ phoneNumber: 'Phone Number should not be empty' });
      }
      const user = await this.usersService.update(id, {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
      });

      if (!user) {
        console.error('User not found');
      }
      return res.redirect('/users/' + id);
    } catch (error) {
      console.error(error);
    }
  }

  @Post()
  async createUser(
    @Body()
    body: {
      name: string | undefined;
      email: string | undefined;
      phoneNumber: string | undefined;
      password: string | undefined;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!body.name || !body.email || !body.phoneNumber || !body.password) {
      const errors: Array<object> = [];

      req.flash('errors', errors);
      req.flash('old', body);
      return res.redirect('/users/create');
    }
    const data = {
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password,
    };
    await this.usersService.create(data);
    return res.redirect('/users');
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = {
      email: updateUserDto.email,
      phoneNumber: updateUserDto.phoneNumber,
      name: updateUserDto.name,
    };
    return this.usersService.update(id, data);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.remove(id);
    return res.redirect('/users');
  }
}
