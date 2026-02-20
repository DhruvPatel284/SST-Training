import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import { PostsService } from 'src/modules/posts/posts.service';
import { FollowsService } from 'src/modules/follows/follows.service';
import { userProfileImageConfig } from 'src/modules/users/config/multer.config';

@Controller('user/profile')
@UseGuards(AuthGuard)
export class UserProfileController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private followsService: FollowsService,
  ) {}

  // ─── OWN PROFILE (EDITABLE) ──────────────────────────────────────────────────
  @Get()
  async getOwnProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }      
      const currentUser = await this.usersService.findOne(userId);

      if (!currentUser) {
        return res.redirect('/login');
      }

      // Get user's posts
      const posts = await this.postsService.getPostsByUser(userId);

      // Get stats
      const stats = await this.usersService.getUserStats(userId);

      return res.render('pages/user/profile/own', {
        layout: 'layouts/user-layout',
        title: 'My Profile',
        page_title: 'My Profile',
        folder: 'Profile',
        user: currentUser,
        profileUser: currentUser,
        posts: posts,
        stats: stats,
        isOwnProfile: true,
        unreadCount: 0,
        success: req.flash('success')[0] || null,
        error: req.flash('error')[0] || null,
        errors: req.flash('errors')[0] || {},
      });
    } catch (error) {
      console.error('Own profile error:', error);
      req.flash('error', 'Failed to load profile');
      return res.redirect('/user/dashboard');
    }
  }

  // ─── OTHER USER PROFILE (READ-ONLY) ──────────────────────────────────────────
  @Get(':id')
  async getUserProfile(
    @Param('id') targetUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const currentUserId = req.session?.userId;
      if(!currentUserId){
        return null;
      }
      // If viewing own profile, redirect to /user/profile
      if (targetUserId === currentUserId) {
        return res.redirect('/user/profile');
      }

      const currentUser = await this.usersService.findOne(currentUserId);
      const targetUser = await this.usersService.findOne(targetUserId);

      if (!targetUser) {
        req.flash('error', 'User not found');
        return res.redirect('/user/search');
      }

      // Check if following
      const isFollowing = await this.followsService.isFollowing(
        currentUserId,
        targetUserId,
      );

      // Get posts (only if following)
      let posts:any = [];
      if (isFollowing) {
        posts = await this.postsService.getPostsByUser(targetUserId);
      }

      // Get stats
      const stats = await this.usersService.getUserStats(targetUserId);

      return res.render('pages/user/profile/other', {
        layout: 'layouts/user-layout',
        title: targetUser.name,
        page_title: targetUser.name,
        folder: 'Profile',
        user: currentUser,
        profileUser: targetUser,
        posts: posts,
        stats: stats,
        isOwnProfile: false,
        isFollowing: isFollowing,
        unreadCount: 0,
      });
    } catch (error) {
      console.error('User profile error:', error);
      req.flash('error', 'Failed to load profile');
      return res.redirect('/user/search');
    }
  }

  // ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
  @Put()
  async updateProfile(
    @Body() body: { name: string; email: string; bio: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log("Hi ----")
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      // Validate
      const errors: Record<string, string[]> = {};
      if (!body.name || body.name.trim() === '') {
        errors.name = ['Name is required'];
      }
      if (!body.email || body.email.trim() === '') {
        errors.email = ['Email is required'];
      }

      if (Object.keys(errors).length > 0) {
        req.flash('errors', errors);
        return res.redirect('/user/profile');
      }

      // Update
      await this.usersService.update(userId, {
        name: body.name.trim(),
        email: body.email.trim(),
        bio: body.bio ? body.bio.trim() : '',
      });

      req.flash('success', 'Profile updated successfully');
      return res.redirect('/user/profile');
    } catch (error) {
      console.error('Update profile error:', error);
      req.flash('error', 'Failed to update profile');
      return res.redirect('/user/profile');
    }
  }

  // ─── UPLOAD PROFILE IMAGE ────────────────────────────────────────────────────
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('profile_image', userProfileImageConfig))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log("hi -------")
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }

      if (!file) {
        req.flash('error', 'No file uploaded');
        return res.redirect('/user/profile');
      }

      await this.usersService.updateProfileImage(userId, file);

      req.flash('success', 'Profile image updated successfully');
      return res.redirect('/user/profile');
    } catch (error) {
      console.error('Upload image error:', error);
      req.flash(
        'error',
        error instanceof BadRequestException
          ? error.message
          : 'Failed to upload image',
      );
      return res.redirect('/user/profile');
    }
  }

  // ─── DELETE PROFILE IMAGE ────────────────────────────────────────────────────
  @Post('delete-image')
  async deleteProfileImage(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }      
      await this.usersService.deleteProfileImage(userId);

      req.flash('success', 'Profile image deleted successfully');
      return res.redirect('/user/profile');
    } catch (error) {
      console.error('Delete image error:', error);
      req.flash('error', 'Failed to delete image');
      return res.redirect('/user/profile');
    }
  }

  // ─── GET FOLLOWERS LIST ──────────────────────────────────────────────────────
  @Get('followers/:id')
  async getFollowersList(
    @Param('id') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const followers = await this.usersService.getFollowers(userId);
      return res.json({ success: true, followers });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to get followers' });
    }
  }

  // ─── GET FOLLOWING LIST ──────────────────────────────────────────────────────
  @Get('following/:id')
  async getFollowingList(
    @Param('id') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const following = await this.usersService.getFollowing(userId);
      return res.json({ success: true, following });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to get following' });
    }
  }
}