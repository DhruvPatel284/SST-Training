import { IsIn } from 'class-validator';
import { User } from 'src/users/user.entity';
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
    type: 'text',
    default: OrderStatus.PENDING,
    })
    @IsIn(Object.values(OrderStatus))
    status: OrderStatus;

    @Column()
    @ManyToOne(()=>User , (user)=>user.orders)
    user : User

    @Column()
    @OneToMany(()=>OrderItem , (order_item)=>order_item.order)
    order_items : OrderItem[]

    @CreateDateColumn()
    order_date: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}