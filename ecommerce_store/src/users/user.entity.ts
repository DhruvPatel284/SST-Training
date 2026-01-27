import { IsIn } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password:string

    @Column({
    type: 'text',
    default: UserRole.USER,
    })
    @IsIn([UserRole.USER, UserRole.ADMIN])
    role: UserRole;

}