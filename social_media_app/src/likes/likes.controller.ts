import { Controller, Param, Post, Request } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
    constructor(
        private likesService : LikesService,
    ){}

    @Post(':PostId')
    async toogle(@Request() req,@Param('postId') postId : string){
       return await this.likesService.toogleLike(req.user.userId , parseInt(postId));
    }

}
