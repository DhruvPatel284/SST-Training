import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersApiController } from './controllers/api/users-api.controller';
import { UsersWebController } from './controllers/web/user-web.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersApiController, UsersWebController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
