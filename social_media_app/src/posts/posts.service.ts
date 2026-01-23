import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './post.entity';
import { CreateAndUpdatePostDto } from './dtos/create-update-post.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepo : Repository<Post>,
        private usersService : UsersService
    ){}

    async createPost(user:User , body : CreateAndUpdatePostDto){
         try {
            const post =  this.postsRepo.create({
                            ...body,
                            user, 
                        });
            return await this.postsRepo.save(post);
         } catch (error) {
            console.log(error);
         }
    }

    async getPost(id:number){
        if (!id) {
            return null;
        }
        return await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,   
            },
        });
    }

    async updatePost(id:number , body:CreateAndUpdatePostDto){
        
       const post = await this.postsRepo.findOneBy({id});
       if(!post){
        throw new NotFoundException('Post Not Found');
       }
       post.content = body.content;
       return this.postsRepo.save(post);
    }

}
