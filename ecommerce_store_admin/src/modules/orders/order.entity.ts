import { IsIn } from 'class-validator';
import { User } from '../users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Address } from '../users/address.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    total_amount: number

    @Column({
    type: 'enum',
    enum:OrderStatus,
    default: OrderStatus.PENDING,
    })
    @IsIn(Object.values(OrderStatus))
    status: OrderStatus;

    @ManyToOne(()=>User , (user)=>user.orders)
    user : User

    @ManyToOne(()=>Address , (address)=>address.orders)
    address : Address

    @OneToMany(()=>OrderItem , (order_item)=>order_item.order)
    order_items : OrderItem[]

    @CreateDateColumn()
    order_date: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}