import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    ProductsModule
  ],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService,TypeOrmModule]
})
export class CartModule {}
