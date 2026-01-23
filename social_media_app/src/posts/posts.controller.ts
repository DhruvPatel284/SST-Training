import { 
    Controller,
    Post  ,
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


@Controller('posts')
@UseGuards(PassportJwtAuthGuard)
export class PostsController {
    constructor(
      private postsService : PostsService,
    ){}

    @Post()
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
    getAll(){

    }

    @Patch(':id')
    async update(@Param('id') id : string, @Body() body : CreateAndUpdatePostDto){
      return await this.postsService.updatePost(parseInt(id),body) 
    }
}
