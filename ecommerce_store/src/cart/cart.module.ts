import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart])
  ],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService,TypeOrmModule]
})
export class CartModule {}
