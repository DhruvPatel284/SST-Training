import { Module } from '@nestjs/common';
import { UserDashboardController } from './controllers/web/user-dashboard-web.controller';

@Module({
  controllers: [UserDashboardController]
})
export class UserPortalModule {}
