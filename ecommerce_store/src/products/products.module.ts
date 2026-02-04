import { Module , forwardRef} from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CartModule } from 'src/cart/cart.module';
import { Cart } from 'src/cart/cart.entity';
import { ProductsWebController } from './products.web.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Cart]),
     forwardRef(() => CartModule),
  ],
  controllers: [ProductsController,ProductsWebController],
  providers: [ProductsService],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
