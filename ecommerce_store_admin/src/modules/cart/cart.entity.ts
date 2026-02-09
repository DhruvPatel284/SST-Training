import { IsIn } from 'class-validator';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
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

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
      default:1
    })
    quantity: number

    @ManyToOne(()=>User , (user)=>user.cart_items)
    user : User

    @ManyToOne(()=>Product , (product)=>product.order_items)
    product : Product

}