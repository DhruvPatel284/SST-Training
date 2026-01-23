import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../posts/post.entity'

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

    @OneToMany(()=>Post,(post)=>post.user)
    posts:Post[]
}