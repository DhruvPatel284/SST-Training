import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from '../posts/post.entity'
import { Comment } from '../comments/comment.entity';

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

    @Column({ nullable: true })
    profile_image?: string;

    @ManyToMany(()=>Post,(post)=>post.likedBy)
    @JoinTable({
      name: 'user_likes_post', 
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
    })
    likes:Post[]
}