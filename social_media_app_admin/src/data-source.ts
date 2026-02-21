import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { OAuthAccessToken } from './modules/oauth-access-token/oauth-access-token.entity';
import { User } from './modules/users/user.entity';
import { Post } from './modules/posts/post.entity';
import { PostMedia } from './modules/posts/post-media.entity';
import { Comment } from './modules/comments/comment.entity';
import { Notification } from './modules/notifications/notification.entity';

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
  entities: [User, OAuthAccessToken, Post, PostMedia, Comment, Notification],
  migrations: [__dirname + '/database/migrations/*.ts'],
  // ssl: {  // this ssl config is needed when connecting to some cloud db providers with https
  //   rejectUnauthorized: false,
  // },
  // logging: true,
  // logging: 'all', //for sql queries logging
});

/*


Name : Dhruv Navinbhai Patel 
Surname : Patel

Father Name : Navinbhai Naranbhai Patel
Employee Code : 257

Designation: Trainee Software Engineer 
Date of Joining : 01/01/2026

Date of Leaving : 
PAN number : HSQPP4158D

Aadhar Number : 5556 5619 5031
Employee's phone number : 9898751449

Father's phone number : 9925693892
personal email : dhruv156328@gmail.com

SST email : dhruvpatel.silversky@gmail.com

Birthdate : 28/04/2005
IFSC Code : SBIN0018832

Account Number : 39565310046
UPI id : dhruv156328@oksbi

Local Living Address : 202/1,I-block,Rudra Square Appartment , near judges bunglow road , Bodakdev , Ahmedabad.
Permanent Address : 11,Gokul Homes , B/H Avsar Party Plot , Near Radhe Exotica , Modhera Road , Mehsana.


*/