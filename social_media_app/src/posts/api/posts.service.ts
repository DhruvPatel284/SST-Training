import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from '../post.entity';
import { CreateAndUpdatePostDto } from './dtos/create-update-post.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepo : Repository<Post>,
        private usersService : UsersService
    ){}

    async createPost(userId: number,{ content }: CreateAndUpdatePostDto) {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        const post = this.postsRepo.create({
            content,
            user,
        });

        return await this.postsRepo.save(post);
    }

    async getPost(id:number){
        if (!id) {
            return null;
        }
        return await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,   
                comments : true
            },
        });
    }
    async getPostByid(userId: number, id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,
                likedBy: true,        // 👈 needed
                comments: {
                    user: true,
                },
            },
        });

        if (!post) {
            throw new NotFoundException('Post Not Found');
        }

        // authorization (your rule)
        if (userId !== post.user.id) {
            throw new UnauthorizedException('Only Creator can See the Post');
        }

        // ===== LIKE COUNT =====
        post.likeCount = post.likedBy.length;

        // ===== IS LIKED BY CURRENT USER =====
        post.isLikedByCurrentUser = post.likedBy.some(
            (user) => user.id === userId,
        );

        return post;
    }

    async getAllPosts(userId:number , query: PaginateQuery): Promise<Paginated<Post>> {
        const qb = this.postsRepo
            .createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .where('post.userId = :userId', { userId })

            .loadRelationCountAndMap(
                'post.commentCount',
                'post.comments',
            )

            .loadRelationCountAndMap(
                'post.likeCount',
                'post.likedBy',
            )

            .select([
                'post.id',
                'post.content',
                'post.createdAt',
                'post.updatedAt',
                'user.id',
                'user.name',
                'user.email',
            ]);

        return paginate(query, qb, {
            sortableColumns: ['id', 'createdAt'],
            defaultSortBy: [['id', 'DESC']],
            defaultLimit: 10,
            searchableColumns: ['content'],
        });
    }


    async updatePost(userId:number,id:number , body:CreateAndUpdatePostDto){
        
       const post = await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true
            },
        });
       if(!post){
         throw new NotFoundException('Post Not Found');
       }
       if(userId != post.user.id){
         throw new UnauthorizedException('Only Creator can Update the Post');
       }
       post.content = body.content;
       return this.postsRepo.save(post);
    }

}
