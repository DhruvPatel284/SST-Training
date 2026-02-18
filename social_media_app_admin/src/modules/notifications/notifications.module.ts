import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),         
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class NotificationsModule {
    
}
