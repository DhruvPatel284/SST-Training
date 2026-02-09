import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from '../orders/order.entity';

@Entity()
export class Address{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    address: string

    @Column()
    district: string

    @Column()
    state:string

    @Column()
    pincode:string

    @ManyToOne(()=>User ,(user)=>user.addresses)
    user : User

    @OneToMany(()=>Order , (order)=>order.address)
    orders : Order[]
    
}