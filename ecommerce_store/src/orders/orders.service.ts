import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { OrderStatus } from './order.entity';
import { Address } from 'src/users/address.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async placeOrder(userId: number, body: any) {
    if (body.singleItem) {
      return this.orderSingleItem(userId, body.cartItemId,body.addressId);
    }
    return this.orderFullCart(userId, body.addressId)
  }

  async orderSingleItem(userId: number, cartItemId: number,addressId:number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cartItem = await queryRunner.manager.findOne(Cart, {
        where: {
          id: cartItemId,
          user: { id: userId },
        },
        relations: {
          product: true,
          user: true,
        },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart Item Not Found');
      }

      const product = cartItem.product;
      if (cartItem.quantity > product.stock) {
        throw new BadRequestException('Product out of stock');
      }

      const address = await queryRunner.manager.findOne(Address, {
            where: {
                id: addressId,
                user: { id: userId },
            },
       });

      if (!address) {
            throw new NotFoundException('Invalid address');
      }

      const order = queryRunner.manager.create(Order, {
        user: cartItem.user,
        address,
        total_amount: cartItem.quantity * product.price,
        status: OrderStatus.PENDING,
      });

      await queryRunner.manager.save(order);

      const orderItem = queryRunner.manager.create(OrderItem, {
        order,
        product,
        quantity: cartItem.quantity,
        total_price: cartItem.quantity * product.price,
      });

      await queryRunner.manager.save(orderItem);

      product.stock -= cartItem.quantity;
      await queryRunner.manager.save(product);

      await queryRunner.manager.remove(cartItem);

      order.status = OrderStatus.CONFIRMED;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      const completeOrder = await this.orderRepo.findOne({
        where: { id: order.id },
        relations: {
          order_items: {
            product: true,
          },
          address: true,
        },
      });

      return completeOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
      
    } finally {
      await queryRunner.release();
    }
  }
  async orderFullCart(userId: number, addressId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cartItems = await queryRunner.manager.find(Cart, {
        where: {
          user: { id: userId },
        },
        relations: {
          product: true,
          user: true,
        },
      });

      if (!cartItems.length) {
        throw new BadRequestException('Cart is empty');
      }

      const address = await queryRunner.manager.findOne(Address, {
        where: {
          id: addressId,
          user: { id: userId },
        },
      });

      if (!address) {
        throw new NotFoundException('Invalid address');
      }

      for (const item of cartItems) {
        if (item.quantity > item.product.stock) {
          throw new BadRequestException(
            `Product ${item.product.name} is out of stock`,
          );
        }
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
      );

      const order = queryRunner.manager.create(Order, {
        user: cartItems[0].user,
        address,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
      });

      await queryRunner.manager.save(order);

      for (const item of cartItems) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          order,
          product: item.product,
          quantity: item.quantity,
          total_price: item.quantity * item.product.price,
        });

        await queryRunner.manager.save(orderItem);

        item.product.stock -= item.quantity;
        await queryRunner.manager.save(item.product);
      }
      await queryRunner.manager.remove(cartItems);

      order.status = OrderStatus.CONFIRMED;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      const completeOrder = await this.orderRepo.findOne({
        where: { id: order.id },
        relations: {
          order_items: {
            product: true,
          },
          address: true,
        },
      });

      return completeOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  

}
