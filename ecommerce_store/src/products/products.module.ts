import { Module , forwardRef} from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CartModule } from 'src/cart/cart.module';
import { Cart } from 'src/cart/cart.entity';
import { ProductsWebController } from './web/products.web.controller';
import { ProductImage } from './product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Cart,ProductImage]),
     forwardRef(() => CartModule),
  ],
  controllers: [ProductsController,ProductsWebController],
  providers: [ProductsService],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
