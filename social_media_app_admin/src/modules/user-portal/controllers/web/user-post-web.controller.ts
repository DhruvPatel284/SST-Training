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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostsService } from 'src/modules/posts/posts.service';
import { CommentsService } from 'src/modules/comments/comments.service';
import { UsersService } from 'src/modules/users/users.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerPostMediaConfig, validateFileSize } from 'src/modules/posts/config/multer-post-media.config';

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
    console.log("Hi ________")
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

  // ─── CREATE POST PAGE ────────────────────────────────────────────────────────
  @Get('create')
  async getCreatePage(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.redirect('/login');
      }

      const currentUser = await this.usersService.findOne(userId);

      return res.render('pages/user/posts/create', {
        layout: 'layouts/user-layout',
        title: 'Create Post',
        page_title: 'Create Post',
        folder: 'Posts',
        user: currentUser,
        unreadCount: 0,
        errors: req.flash('errors')[0] || {},
        old: req.flash('old')[0] || {},
      });
    } catch (error) {
      console.error('Create post page error:', error);
      req.flash('error', 'Failed to load create page');
      return res.redirect('/user/dashboard');
    }
  }

  // ─── CREATE POST ─────────────────────────────────────────────────────────────
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 10 },
      ],
      multerPostMediaConfig,
    ),
  )
  async createPost(
    @Body() body: { content: string },
    @UploadedFiles() files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.redirect('/login');
      }

      // Validate content
      if (!body.content || body.content.trim() === '') {
        req.flash('errors', { content: ['Post content is required'] });
        req.flash('old', body);
        return res.redirect('/user/posts/create');
      }

      // Validate file sizes
      if (files?.images) {
        files.images.forEach(file => validateFileSize(file));
      }
      if (files?.videos) {
        files.videos.forEach(file => validateFileSize(file));
      }

      // Extract filenames
      const imageFilenames = files?.images?.map(file => file.filename) || [];
      const videoFilenames = files?.videos?.map(file => file.filename) || [];

      // Create post using your existing service method
      const post = await this.postsService.create(
        userId,
        body.content.trim(),
        imageFilenames,
        videoFilenames,
      );

      req.flash('success', 'Post created successfully!');
      return res.redirect(`/user/posts/${post.id}`);
    } catch (error) {
      console.error('Create post error:', error);
      req.flash('errors', { general: [error.message || 'Failed to create post'] });
      req.flash('old', body);
      return res.redirect('/user/posts/create');
    }
  }

  // ─── VIEW SINGLE POST ────────────────────────────────────────────────────────
  @Get(':id')
  async getPost(
    @Param('id') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.redirect('/login');
      }

      const currentUser = await this.usersService.findOne(userId);

      // Get post with all relations using your existing findOne
      const post = await this.postsService.findOne(parseInt(postId));

      if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/user/dashboard');
      }

      // Check if user liked the post
      const isLiked = post.likedBy?.some((like) => like.id === userId) || false;

      // Get comments
      const comments = await this.commentsService.getCommentsForPost(parseInt(postId));

      return res.render('pages/user/posts/show', {
        layout: 'layouts/user-layout',
        title: 'Post',
        page_title: 'Post',
        folder: 'Posts',
        user: currentUser,
        post: {
          ...post,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          isLiked: isLiked,
        },
        comments: comments,
        isOwner: post.user.id === userId,
        unreadCount: 0,
      });
    } catch (error) {
      console.error('Get post error:', error);
      req.flash('error', 'Failed to load post');
      return res.redirect('/user/dashboard');
    }
  }
}