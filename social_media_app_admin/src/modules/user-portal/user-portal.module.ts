import { Module } from '@nestjs/common';
import { UserPortalController } from './controllers/web/user-portal-web.controller';

@Module({
  controllers: [UserPortalController]
})
export class UserPortalModule {}
