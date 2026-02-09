import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OAuthAccessToken } from '../oauth-access-token/oauth-access-token.entity';
import { Address } from './address.entity';
import { Order } from '../orders/order.entity'
import { Cart } from '../cart/cart.entity';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class User {
  /* ----------------------Structure---------------------- */

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  firebaseUid: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'varchar', default: UserRole.User })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  /* ----------------------Relationships---------------------- */

  @OneToMany(() => OAuthAccessToken, (accessToken) => accessToken.user)
  accessTokens: OAuthAccessToken[];

  @OneToMany(()=>Address ,(address)=>address.user)
  addresses : Address[]
    
  @OneToMany(()=>Order ,(order)=>order.user)
  orders : Order[]

  @OneToMany(()=>Cart ,(cart)=>cart.user)
  cart_items : Cart[]
}
