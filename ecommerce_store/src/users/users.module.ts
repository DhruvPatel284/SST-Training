import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { UsersWebController } from './web/users.web.controllers';

@Module({
 imports : [
    TypeOrmModule.forFeature([User,Address]),
  ],
  controllers: [UsersController,UsersWebController],
  providers: [UsersService,AddressesService],
  exports: [UsersService,TypeOrmModule],
})
export class UsersModule {}
