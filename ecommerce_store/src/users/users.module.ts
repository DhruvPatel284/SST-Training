import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';

@Module({
 imports : [
    TypeOrmModule.forFeature([User,Address]),
  ],
  controllers: [UsersController],
  providers: [UsersService,AddressesService],
  exports: [UsersService,TypeOrmModule],
})
export class UsersModule {}
