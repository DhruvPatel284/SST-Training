import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepo : Repository<Comment>,
        private postsService : PostsService,
        private usersService : UsersService
    ){}

    async createComment(
        userId: number,
        postId: number,
        comment : string,
    ) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const post = await this.postsService.getPost(postId);
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const commentEntity = this.commentsRepo.create({
            comment,
            user,
            post,
        });

        return await this.commentsRepo.save(commentEntity);
    }

    async updateComment(userId:number,id:number , comment:string){
       const commentRes = await this.commentsRepo.findOne({
        where:{id},
        relations:{user:true}
       });
       if(!commentRes){
        throw new NotFoundException('Post Not Found');
       }
       if(userId != commentRes.user.id){
        return new UnauthorizedException('Only Authorized user can Update the comment');
       }

       commentRes.comment = comment;
       return this.commentsRepo.save(commentRes);
    }
    
    async getComments(postId:number,query: PaginateQuery):Promise<Paginated<Comment>>{
       const qb = this.commentsRepo
            .createQueryBuilder('comment')
            .leftJoin('comment.user', 'user')
            .leftJoin('comment.post', 'post')
            .where('post.id = :postId', { postId })
            .select([
            'comment.id',
            'comment.comment',
            'comment.createdAt',
            'comment.updatedAt',
            'user.id',
            'user.name',
            'user.email',
            ]);

        return paginate(query, qb, {
            sortableColumns: ['id', 'createdAt'],
            defaultSortBy: [['createdAt', 'DESC']],
            defaultLimit: 5,
        });
    }
}
