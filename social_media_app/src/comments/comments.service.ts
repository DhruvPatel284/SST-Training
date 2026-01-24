import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/users/user.entity';
import { Post } from 'src/posts/post.entity';
import { CreateAndUpdateCommentDto } from './dtos/create-and-update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepo : Repository<Comment>
    ){}

    async createComment(user:User,post:Post,{comment,postId}:CreateAndUpdateCommentDto){
        console.log(user);
        console.log(post);
       const commentRes =  this.commentsRepo.create({
                            comment,
                            user,
                            post 
                        });
        return await this.commentsRepo.save(commentRes);
    }

    async updateComment(id:number , comment:string){
       const commentRes = await this.commentsRepo.findOneBy({id});
       if(!commentRes){
        throw new NotFoundException('Post Not Found');
       }
       commentRes.comment = comment;
       return this.commentsRepo.save(commentRes);
    }
    
}
