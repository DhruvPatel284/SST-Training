import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Address } from './address.entity';
import { IsIn } from 'class-validator';
import { Order } from '../orders/order.entity'
import { Cart } from 'src/cart/cart.entity';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password:string

    @Column()
    phone_no:string

    @Column()
    @OneToMany(()=>Address ,(address)=>address.user)
    addresses : Address[]
    
    @Column()
    @OneToMany(()=>Order ,(order)=>order.user)
    orders : Order[]

    @Column()
    @OneToMany(()=>Cart ,(cart)=>cart.user)
    cart_items : Cart[]

    @Column({
    type: 'text',
    default: UserRole.USER,
    })
    @IsIn([UserRole.USER, UserRole.ADMIN])
    role: UserRole;

}