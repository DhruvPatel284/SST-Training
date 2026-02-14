import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Render,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostsService } from '../api/posts.service';
import { CreateAndUpdatePostDto } from '../api/dtos/create-update-post.dto';
import { PassportJwtAuthGuard } from '../../guards/passport-jwt-auth.guard';
import { multerPostMediaConfig } from '../config/multer.config';

@Controller('posts')
@UseGuards(PassportJwtAuthGuard)
export class PostsWebController {
  constructor(private postsService: PostsService) {}

  // ===== LIST POSTS =====
  @Get()
  @Render('posts/list')
  async list(@Request() req) {
    const { page, limit, search, sortBy } = req.query;

    const data = await this.postsService.getAllPosts(
      req.user.userId,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search ? String(search) : undefined,
        sortBy: sortBy
          ? [String(sortBy).split(':') as [string, 'ASC' | 'DESC']]
          : undefined,
        path: '/posts',
      },
    );

    return {
      posts: data.data,
      meta: data.meta,
      links: data.links,
      query: req.query,
      user: req.user,
    };
  }

  // ===== CREATE PAGE =====
  @Get('new')
  @Render('posts/create')
  createPage() {
    return {};
  }

  // ===== CREATE POST =====
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerPostMediaConfig,
    ),
  )
  async create(
    @Request() req,
    @Body() body: CreateAndUpdatePostDto,
    @UploadedFiles() files: { images?: Express.Multer.File[], videos?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    await this.postsService.createPost(req.user.userId, body, files);
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
    return { post, user: req.user };
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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerPostMediaConfig,
    ),
  )
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: CreateAndUpdatePostDto,
    @UploadedFiles() files: { images?: Express.Multer.File[], videos?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    await this.postsService.updatePost(
      req.user.userId,
      Number(id),
      body,
      files,
    );
    return res.redirect(`/posts/${id}`);
  }

  // ===== DELETE MEDIA =====
  @Delete(':postId/media/:mediaId')
  async deleteMedia(
    @Request() req,
    @Param('postId') postId: string,
    @Param('mediaId') mediaId: string,
    @Res() res: Response,
  ) {
    console.log("DELETE .>>>>>>>")
    await this.postsService.deletePostMedia(
      req.user.userId,
      Number(postId),
      Number(mediaId),
    );
    
    return res.json({ success: true, message: 'Media deleted successfully' });
  }
}