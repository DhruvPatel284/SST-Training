import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  async getOrdersPaginate(query: PaginateQuery): Promise<Paginated<Order>> {
    const queryBuilder = this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product', 'product');

    const results = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'total_amount', 'status', 'order_date', 'updatedAt'],
      searchableColumns: ['status'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 1000,        // ← allow DataTables to fetch all at once
      filterableColumns: {
        status: true,
      },
    });

    return results;
  }

  async getOrdersByUser(userId: string, query: PaginateQuery): Promise<Paginated<Order>> {
    const queryBuilder = this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product', 'product')
      .where('user.id = :userId', { userId });

    const results = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'total_amount', 'status', 'order_date'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 1000,        // ← allow DataTables to fetch all at once
    });

    return results;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.repo.findOne({
      where: { id },
      relations: ['user', 'address', 'order_items', 'order_items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.repo.save(order);
  }

  getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
    const flow: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]:   [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED,   OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]:   [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    return flow[currentStatus] ?? [];
  }
}