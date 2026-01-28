import { IsIn } from 'class-validator';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    //quantity*product.price
    @Column()
    total_price: number

    @ManyToOne(()=>Order , (order)=>order.order_items)
    order : Order

    @ManyToOne(()=>Product , (product)=>product.order_items)
    product : Product

}