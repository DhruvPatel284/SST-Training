import { Cart } from 'src/cart/cart.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
      default:0
    })
    price: number

    @Column({
      default:0
    })
    stock:number

    @Column()
    category:string

    @OneToMany(()=>Cart , (cart)=>cart.product)
    cart_items : Cart

    @OneToMany(()=>OrderItem , (order_item)=>order_item.product)
    order_items : OrderItem[]

    orderCount?: number
}