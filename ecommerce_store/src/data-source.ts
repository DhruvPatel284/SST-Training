import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

//import { OAuthAccessToken } from './oauth-access-token/oauth-access-token.entity';
import { User } from './users/user.entity';
import { Address } from './users/address.entity';
import { Product } from './products/product.entity';
import { Cart } from './cart/cart.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

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
  entities: [User,Address,Product,Cart,Order,OrderItem], // or __dirname + '/database/migrations/*.ts'
  migrations: [__dirname + '/database/migrations/*.ts'],
  // ssl: {  // this ssl config is needed when connecting to some cloud db providers with https
  //   rejectUnauthorized: false,
  // },
  // logging: true,
  // logging: 'all', //for sql queries logging
});
