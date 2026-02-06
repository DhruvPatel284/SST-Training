import { Module , forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { AddressesService } from './addresses.service';
import { UsersWebController } from './web/users.web.controllers';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';
import { AdminWebController } from './web/admin.web.controllers';

@Module({
 imports : [
    TypeOrmModule.forFeature([User,Address]),
    forwardRef(()=>ProductsModule),
    forwardRef(()=>OrdersModule)
  ],
  controllers: [UsersController,UsersWebController,AdminWebController],
  providers: [UsersService,AddressesService,ProductsService,OrdersService],
  exports: [UsersService,TypeOrmModule],
})
export class UsersModule {}
