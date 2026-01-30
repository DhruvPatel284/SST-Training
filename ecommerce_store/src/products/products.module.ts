import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CartModule } from 'src/cart/cart.module';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Cart]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
