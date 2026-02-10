import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { AuthGuard } from '../../../../common/guards/auth.guard';
import { PostsService } from '../../posts.service';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsWebController {
  constructor(private postsService: PostsService) {}

  // ─── LIST ────────────────────────────────────────────────────────────────────

  @Get()
  async getPostList(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const isAjax =
      request.xhr ||
      request.headers['accept']?.includes('application/json') ||
      request.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      const result = await this.postsService.getPostsPaginate(query);

      // Attach virtual counts to each item so the DataTable receives them
      const enriched = {
        ...result,
        data: result.data.map((post) => ({
          ...post,
          commentCount: post.comments?.length ?? 0,
          likeCount: post.likedBy?.length ?? 0,
        })),
      };

      return res.json(enriched);
    }

    return res.render('pages/post/index', {
      title: 'Post List',
      page_title: 'Post DataTable',
      folder: 'Post',
    });
  }

  // ─── SHOW ────────────────────────────────────────────────────────────────────

  @Get('/:id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const post = await this.postsService.findOne(id);

    if (!post) return res.redirect('/posts');

    const successMessage = req.flash('success')[0] || null;

    return res.render('pages/post/show', {
      title: 'Post Detail',
      page_title: 'Post Detail',
      folder: 'Post',
      post,
      successMessage,
    });
  }

  // ─── TOGGLE REVIEWED ─────────────────────────────────────────────────────────

  @Post('/:id/toggle-reviewed')
  async toggleReviewed(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const post = await this.postsService.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    await this.postsService.toggleReviewed(id);

    const newStatus = !post.Reviewed;
    req.flash(
      'success',
      `Post has been marked as ${newStatus ? 'Reviewed ✓' : 'Unreviewed ✗'}`,
    );

    return res.redirect(`/posts/${id}`);
  }
}