import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Post } from '../posts/post.entity'
import { Comment } from '../comments/comment.entity';
import { OAuthAccessToken } from '../oauth-access-token/oauth-access-token.entity';

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

  @Column({ nullable : true})
  phoneNumber?: string;

  @Column({ nullable: true })
  firebaseUid: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'varchar', default: UserRole.User })
  role: UserRole;

  @Column({ nullable: true })
  profile_image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  /* ----------------------Relationships---------------------- */

  @OneToMany(() => OAuthAccessToken, (accessToken) => accessToken.user)
  accessTokens: OAuthAccessToken[];

  @OneToMany(()=>Post,(post)=>post.user)
  posts:Post[];

  @OneToMany(()=>Comment,(comment)=>comment.user)
  comments:Comment[];

  @ManyToMany(()=>Post,(post)=>post.likedBy)
  @JoinTable({
    name: 'user_likes_post', 
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  likes:Post[];

  @ManyToMany(() => User, user => user.following)
  @JoinTable({ name: 'user_follows' })
  followers: User[];

  @ManyToMany(() => User, user => user.followers)
  following: User[];

  // Virtual fields
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}
