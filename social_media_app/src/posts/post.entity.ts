import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @ManyToOne(() => User, (user) => user.posts)
    user:User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}