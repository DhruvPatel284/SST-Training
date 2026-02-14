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
import { ProductImage } from './product-image.entity';

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

    @OneToMany(() => ProductImage, (image) => image.product, {
      cascade: true,
    })
    images: ProductImage[];

    orderCount?: number
    inCart?: boolean;
    cartQuantity?: number;
}