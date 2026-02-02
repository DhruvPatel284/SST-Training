import { 
    Controller,
    Post as PostReq ,
    Get ,
    Patch,
    UseGuards ,
    Request,
    Body,
    Param,
    NotFoundException
} from '@nestjs/common';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreateAndUpdatePostDto } from './dtos/create-update-post.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Post } from '../post.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreatePostResDto } from './dtos/create-post-res.dto';



@Controller('api/posts')
@UseGuards(PassportJwtAuthGuard)
export class PostsController {
    constructor(
      private postsService : PostsService,
    ){}

    @PostReq()
    @Serialize(CreatePostResDto)
    async create(@Request() req , @Body() body : CreateAndUpdatePostDto){
      return await this.postsService.createPost(req.user.userId, body);
    }

    @Get(':id')
    async getPost(@Request()req , @Param('id') id : string){
      return await this.postsService.getPostByid(req.user.userId, parseInt(id));
    }

    @Get()
    async getAll(@Request() req , @Paginate() query:PaginateQuery):Promise<Paginated<Post>>{
       return await this.postsService.getAllPosts(req.user.userId,query);
    }

    @Patch(':id')
    @Serialize(CreatePostResDto)
    async update(@Request() req,@Param('id') id : string, @Body() body : CreateAndUpdatePostDto){
      return await this.postsService.updatePost(req.user.userId,parseInt(id),body) 
    }
}
