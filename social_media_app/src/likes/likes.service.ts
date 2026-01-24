import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
    constructor(
      private usersService : UsersService,
      private postsService : PostsService
    ){}

    async toogleLike(userId: number , postId: number){
        const user = await this.usersService.findOne(userId);
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        const post = await this.postsService.getPost(postId);
        if(!post){
            throw new NotFoundException('Post Not Found');
        }
        
    }
}
