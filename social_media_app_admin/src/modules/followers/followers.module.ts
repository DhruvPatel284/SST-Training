import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
