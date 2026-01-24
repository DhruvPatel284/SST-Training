import { 
    Controller,
    Post  ,
    Get ,
    Patch,
    UseGuards ,
    Request,
    Body,
    Param,
    NotFoundException,
    RequestMethod
} from '@nestjs/common';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { CommentsService } from './comments.service';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Comment } from './comment.entity';
import { CreateAndUpdateCommentDto } from './dtos/create-and-update-comment.dto';
import { CreateAndUpdatePostDto } from 'src/posts/dtos/create-update-post.dto';
import { PassportAuthGuard } from 'src/guards/passport-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateCommentResDto } from './dtos/create-comment-res.dto';

@Controller('comments')
@UseGuards(PassportJwtAuthGuard)
export class CommentsController {
    constructor(
        private commentsService : CommentsService
    ){}
    @Post(':postId')
    @Serialize(CreateCommentResDto)
    async create(@Request() req , @Param('postId') postId:string , @Body() body:CreateAndUpdateCommentDto){
       return await this.commentsService.createComment(req.user.userId,parseInt(postId),body.comment);
    }

    @Patch(':id')
    @Serialize(CreateCommentResDto)
    async update(@Request() req,@Param('id') id : string, @Body() body : CreateAndUpdateCommentDto){
       return await this.commentsService.updateComment(req.user.userId,parseInt(id),body.comment);
    }
    
    @Get(':postId')
    async get(@Param('postId') postId:string , @Paginate() query:PaginateQuery):Promise<Paginated<Comment>>{
       console.log(postId)
       return await this.commentsService.getComments(parseInt(postId),query);
    }
}
