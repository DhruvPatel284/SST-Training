import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import { FollowsService } from 'src/modules/follows/follows.service';
import { User } from 'src/modules/users/user.entity';

@Controller('user/search')
@UseGuards(AuthGuard)
export class UserSearchController {
  constructor(
    private usersService: UsersService,
    private followsService: FollowsService,
  ) {}

  // ─── SEARCH PAGE ─────────────────────────────────────────────────────────────
  @Get()
  async getSearchPage(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }      
      const currentUser = await this.usersService.findOne(userId);

      if (!currentUser) {
        return res.redirect('/login');
      }

      // Get search query from URL
      const searchQuery = (req.query.q as string) || '';

      let users:User[] = [];
      let followingMap = new Map();

      if (searchQuery.trim()) {
        // Search users by name or email
        users = await this.usersService.searchUsers(searchQuery, userId);

        // Get following status for each user
        const following = await this.usersService.getFollowing(userId);
        following.forEach((user) => {
          followingMap.set(user.id, true);
        });
      } else {
        // If no search query, show suggested users (not following yet)
        users = await this.usersService.getSuggestedUsers(userId, 20);
      }

      return res.render('pages/user/search', {
        layout: 'layouts/user-layout',
        title: 'Search',
        page_title: 'Search Users',
        folder: 'Search',
        user: currentUser,
        searchQuery: searchQuery,
        users: users,
        followingMap: followingMap,
        unreadCount: 0, // TODO: integrate notifications
      });
    } catch (error) {
      console.error('Search page error:', error);
      req.flash('errors', 'Failed to load search page');
      return res.redirect('/user/dashboard');
    }
  }

  // ─── SEARCH API (AJAX) ───────────────────────────────────────────────────────
  @Get('api')
  async searchUsersApi(
    @Query('q') query: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      if (!query || query.trim() === '') {
        return res.json({
          success: true,
          users: [],
        });
      }

      const users = await this.usersService.searchUsers(query, userId);

      // Get following status
      const following = await this.usersService.getFollowing(userId);
      const followingIds = new Set(following.map((u) => u.id));

      const usersWithFollowStatus = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        isFollowing: followingIds.has(user.id),
      }));

      return res.json({
        success: true,
        users: usersWithFollowStatus,
      });
    } catch (error) {
      console.error('Search API error:', error);
      return res.status(500).json({
        success: false,
        error: 'Search failed',
      });
    }
  }

  // ─── FOLLOW USER ─────────────────────────────────────────────────────────────
  @Post(':id/follow')
  async followUser(
    @Param('id') targetUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const currentUserId = req.session?.userId;
      if(!currentUserId){
        return null;
      }
      if (currentUserId === targetUserId) {
        return res.status(400).json({
          success: false,
          error: 'You cannot follow yourself',
        });
      }

      await this.followsService.follow(currentUserId, targetUserId);

      return res.json({
        success: true,
        message: 'User followed successfully',
      });
    } catch (error) {
      console.error('Follow error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to follow user',
      });
    }
  }

  // ─── UNFOLLOW USER ───────────────────────────────────────────────────────────
  @Delete(':id/follow')
  async unfollowUser(
    @Param('id') targetUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      await this.followsService.unfollow(userId, targetUserId);

      return res.json({
        success: true,
        message: 'User unfollowed successfully',
      });
    } catch (error) {
      console.error('Unfollow error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to unfollow user',
      });
    }
  }

  // ─── GET FOLLOWERS LIST ──────────────────────────────────────────────────────
  @Get('followers')
  async getFollowers(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      const followers = await this.usersService.getFollowers(userId);

      return res.json({
        success: true,
        followers: followers,
      });
    } catch (error) {
      console.error('Get followers error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get followers',
      });
    }
  }

  // ─── GET FOLLOWING LIST ──────────────────────────────────────────────────────
  @Get('following')
  async getFollowing(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if(!userId){
        return null;
      }
      const following = await this.usersService.getFollowing(userId);

      return res.json({
        success: true,
        following: following,
      });
    } catch (error) {
      console.error('Get following error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get following',
      });
    }
  }
}