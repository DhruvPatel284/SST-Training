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
    @Post()
    @Serialize(CreateCommentResDto)
    async create(@Request() req , @Body() body:CreateAndUpdateCommentDto){
       return await this.commentsService.createComment(req.currentUser,req.currentPost,body);
    }

    @Patch(':id')
    async update(@Param('id') id : string, @Body() body : CreateAndUpdateCommentDto){
       return await this.commentsService.updateComment(parseInt(id),body.comment);
    }
}
