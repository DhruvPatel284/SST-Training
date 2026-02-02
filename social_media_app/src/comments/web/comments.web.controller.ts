import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CommentsService } from '../api/comments.service';
import { CreateAndUpdateCommentDto } from '../api/dtos/create-and-update-comment.dto';
import { PassportJwtAuthGuard } from '../../guards/passport-jwt-auth.guard';

@Controller('posts/:postId/comments')
@UseGuards(PassportJwtAuthGuard)
export class CommentsWebController {
  constructor(private commentsService: CommentsService) {}

  // ===== CREATE COMMENT =====
  @Post()
  async create(
    @Request() req,
    @Param('postId') postId: string,
    @Body() body: CreateAndUpdateCommentDto,
    @Res() res: Response,
  ) {
    await this.commentsService.createComment(
      req.user.userId,
      Number(postId),
      body.comment,
    );

    return res.redirect(`/posts/${postId}`);
  }

  // ===== UPDATE COMMENT =====
  @Patch(':id')
  async update(
    @Request() req,
    @Param('postId') postId: string,
    @Param('id') id: string,
    @Body() body: CreateAndUpdateCommentDto,
    @Res() res: Response,
  ) {
    await this.commentsService.updateComment(
      req.user.userId,
      Number(id),
      body.comment,
    );

    return res.redirect(`/posts/${postId}`);
  }
}
