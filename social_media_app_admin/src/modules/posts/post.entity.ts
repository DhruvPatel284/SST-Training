import { User } from '../users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @Column({ default: true })
    Reviewed: boolean;

    @ManyToOne(() => User, (user) => user.posts)
    user:User

    @OneToMany(()=>Comment,(comment)=>comment.post)
    comments:Comment[]

    @ManyToMany(()=>User,(user)=>user.likes)
    likedBy:User[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    commentCount?: number;
    likeCount?: number;
    isLikedByCurrentUser?: boolean;
}