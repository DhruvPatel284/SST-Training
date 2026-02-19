import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostsService } from 'src/modules/posts/posts.service';
import { CommentsService } from 'src/modules/comments/comments.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('user/posts')
@UseGuards(AuthGuard)
export class UserPostsController {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  // ─── LIKE / UNLIKE POST ──────────────────────────────────────────────────────
  @Post(':id/like')
  async toggleLike(
    @Param('id') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }      
      const result = await this.postsService.toggleLike(
        parseInt(postId),
        userId,
      );

      return res.json({
        success: true,
        isLiked: result.isLiked,
        likeCount: result.likeCount,
      });
    } catch (error) {
      console.error('Like error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to toggle like',
      });
    }
  }

  // ─── ADD COMMENT ─────────────────────────────────────────────────────────────
  @Post(':id/comment')
  async addComment(
    @Param('id') postId: string,
    @Body() body: { content: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }

      if (!body.content || body.content.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Comment content is required',
        });
      }

      const comment = await this.commentsService.create({
        postId: parseInt(postId),
        userId: userId,
        content: body.content.trim(),
      });

      // Get comment with user info for response
      const commentWithUser = await this.commentsService.findOneWithUser(
        comment.id,
      );
      if(!commentWithUser){
        throw new NotFoundException('Comment Not Found')
      }

      return res.json({
        success: true,
        comment: {
          id: commentWithUser.id,
          content: commentWithUser.comment,
          createdAt: commentWithUser.createdAt,
          user: {
            id: commentWithUser.user.id,
            name: commentWithUser.user.name,
            profile_image: commentWithUser.user.profile_image,
          },
        },
      });
    } catch (error) {
      console.error('Comment error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to add comment',
      });
    }
  }

  // ─── GET PAGINATED FEED ──────────────────────────────────────────────────────
  @Get('feed')
  async getFeedPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;

      // Get following list
      const following = await this.usersService.getFollowing(userId);
      const followingIds = following.map((user) => user.id);

      // Get paginated feed
      const result = await this.postsService.getFeedPaginated(
        userId,
        followingIds,
        pageNumber,
        limitNumber,
      );

      return res.json({
        success: true,
        posts: result.posts,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalPosts: result.totalPosts,
          hasMore: result.hasMore,
        },
      });
    } catch (error) {
      console.error('Feed pagination error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to load feed',
      });
    }
  }

  // ─── DELETE POST ─────────────────────────────────────────────────────────────
  @Delete(':id')
  async deletePost(
    @Param('id') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }

      // Check if post belongs to user
      const post = await this.postsService.findOne(parseInt(postId));

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      if (post.user.id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You can only delete your own posts',
        });
      }

      await this.postsService.remove(parseInt(postId));

      return res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete post',
      });
    }
  }
}