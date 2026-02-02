import { Controller, Param, Post, Get, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery, Paginated } from 'nestjs-paginate';
import { User } from 'src/users/user.entity';

@Controller('api/likes')
@UseGuards(PassportJwtAuthGuard)
export class LikesController {
    constructor(
        private likesService : LikesService,
    ){}

    @Post(':postId')
    async toogle(@Request() req,@Param('postId') postId : string){
       return await this.likesService.toggleLike(req.user.userId , parseInt(postId));
    }

    @Get('post/:postId')
    async get(@Param('postId') postId : string , @Paginate() query:PaginateQuery): Promise<Paginated<User>>{
        return this.likesService.getUsersWhoLikedPost(parseInt(postId), query);
    }
}
