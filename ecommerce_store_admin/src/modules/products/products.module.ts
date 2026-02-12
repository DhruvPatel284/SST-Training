import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsWebController } from './controllers/web/product-web.controller';
import { ProductImage } from './product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductImage])],
  controllers: [ProductsWebController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}