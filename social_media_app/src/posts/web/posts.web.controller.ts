import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type{ Response } from 'express';
import { PostsService } from '../api/posts.service';
import { CreateAndUpdatePostDto } from '../api/dtos/create-update-post.dto';
import { PassportJwtAuthGuard } from '../../guards/passport-jwt-auth.guard';

@Controller('posts')
@UseGuards(PassportJwtAuthGuard)
export class PostsWebController {
  constructor(private postsService: PostsService) {}

  // ===== LIST POSTS =====
  @Get()
  @Render('posts/list')
  async list(@Request() req) {
    const data = await this.postsService.getAllPosts(req.user.userId, {
      page: 1,
      limit: 10,
      path: '',
    });

    return { posts: data.data };
  }

  // ===== CREATE PAGE =====
  @Get('new')
  @Render('posts/create')
  createPage() {
    return {};
  }

  // ===== CREATE POST =====
  @Post()
  async create(
    @Request() req,
    @Body() body: CreateAndUpdatePostDto,
    @Res() res: Response,
  ) {
    await this.postsService.createPost(req.user.userId, body);
    return res.redirect('/posts');
  }

  // ===== VIEW POST =====
  @Get(':id')
  @Render('posts/detail')
  async detail(@Request() req, @Param('id') id: string) {
    const post = await this.postsService.getPostByid(
      req.user.userId,
      Number(id),
    );
    return { post,user:req.user };
  }

  // ===== EDIT PAGE =====
  @Get(':id/edit')
  @Render('posts/edit')
  async editPage(@Request() req, @Param('id') id: string) {

    const post = await this.postsService.getPostByid(
      req.user.userId,
      Number(id),
    );
    return { post };
  }

  // ===== UPDATE POST =====
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: CreateAndUpdatePostDto,
    @Res() res: Response,
  ) {
    await this.postsService.updatePost(
      req.user.userId,
      Number(id),
      body,
    );
    return res.redirect(`/posts/${id}`);
  }
}
