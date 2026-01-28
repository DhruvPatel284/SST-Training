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

    @Column({ nullable: true })
    name?: string

    @Column()
    email: string

    @Column()
    password:string

    @Column({ nullable: true })
    phone_no?:string

    @OneToMany(()=>Address ,(address)=>address.user)
    addresses : Address[]
    
    @OneToMany(()=>Order ,(order)=>order.user)
    orders : Order[]

    @OneToMany(()=>Cart ,(cart)=>cart.user)
    cart_items : Cart[]

    @Column({
    type: 'text',
    default: UserRole.USER,
    })
    @IsIn([UserRole.USER, UserRole.ADMIN])
    role: UserRole;

}