import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../posts/post.entity'
import { Comment } from '../posts/comment.entity';

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

    @OneToMany(()=>Comment,(comment)=>comment.user)
    comments:Comment[]
}