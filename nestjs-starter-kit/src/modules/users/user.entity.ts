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

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
export class User {
  /* ----------------------Structure---------------------- */

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

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
}
