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
import { Post } from './post.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreatePostResDto } from './dtos/create-post-res.dto';



@Controller('posts')
@UseGuards(PassportJwtAuthGuard)
export class PostsController {
    constructor(
      private postsService : PostsService,
    ){}

    @PostReq()
    @Serialize(CreatePostResDto)
    async create(@Request() req , @Body() body : CreateAndUpdatePostDto){
      return await this.postsService.createPost(req.currentUser, body);
    }

    @Get(':id')
    async getPost(@Param('id') id : string){
      const post = await this.postsService.getPost(parseInt(id));
      if(!post){
        throw new NotFoundException('Post is not available');
      }
      return post;
    }

    @Get()
    async getAll(@Paginate() query:PaginateQuery):Promise<Paginated<Post>>{
       return await this.postsService.getAllPosts(query);
    }

    @Patch(':id')
    async update(@Param('id') id : string, @Body() body : CreateAndUpdatePostDto){
      return await this.postsService.updatePost(parseInt(id),body) 
    }
}
