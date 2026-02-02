import {
  Controller,
  Post,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { LikesService } from '../api/likes.service';
import { PassportJwtAuthGuard } from '../../guards/passport-jwt-auth.guard';

@Controller('posts/:postId/likes')
@UseGuards(PassportJwtAuthGuard)
export class LikesWebController {
  constructor(private likesService: LikesService) {}

  // ===== TOGGLE LIKE =====
  @Post()
  async toggle(
    @Request() req,
    @Param('postId') postId: string,
    @Res() res: Response,
  ) {
    console.log("hiii")
    await this.likesService.toggleLike(
      req.user.userId,
      Number(postId),
    );
    
    return res.redirect(`/posts/${postId}`);
  }
}
