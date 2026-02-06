import { Module,forwardRef } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { CartWebController } from './web/cart.web.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule)
  ],
  controllers: [CartController,CartWebController],
  providers: [CartService],
  exports:[CartService,TypeOrmModule]
})
export class CartModule {}
