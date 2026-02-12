import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { OAuthAccessToken } from './modules/oauth-access-token/oauth-access-token.entity';
import { User } from './modules/users/user.entity';
import { Address } from './modules/users/address.entity';
import { Product } from './modules/products/product.entity';
import { Cart } from './modules/cart/cart.entity';
import { Order } from './modules/orders/order.entity';
import { OrderItem } from './modules/orders/order-item.entity';
import { ProductImage } from './modules/products/product-image.entity';

// we can't access configService directly here because this file is loaded before the AppModule
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [User, OAuthAccessToken,Address,Product,ProductImage,Cart,Order,OrderItem], // or __dirname + '/database/migrations/*.ts'
  migrations: [__dirname + '/database/migrations/*.ts'],
  // ssl: {  // this ssl config is needed when connecting to some cloud db providers with https
  //   rejectUnauthorized: false,
  // },
  // logging: true,
  // logging: 'all', //for sql queries logging
});
