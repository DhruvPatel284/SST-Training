import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Follow a user
   * @param followerId - User who is following
   * @param followingId - User being followed
   */
  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    const following = await this.userRepo.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new BadRequestException('User not found');
    }

    const isAlreadyFollowing = follower.following.some(
      (user) => user.id === followingId,
    );

    if (isAlreadyFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    follower.following.push(following);
    await this.userRepo.save(follower);

    // CREATE NOTIFICATION (ADD THIS)
    try {
      await this.notificationsService.createFollowNotification(
        followingId,
        followerId,
      );
    } catch (error) {
      console.error('Failed to create follow notification:', error);
    }

    return {
      success: true,
      message: 'User followed successfully',
    };
  }

  /**
   * Unfollow a user
   * @param followerId - User who is unfollowing
   * @param followingId - User being unfollowed
   */
  async unfollow(followerId: string, followingId: string) {
    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower) {
      throw new BadRequestException('User not found');
    }

    // Check if actually following
    const followingIndex = follower.following.findIndex(
      (user) => user.id === followingId,
    );

    if (followingIndex === -1) {
      throw new BadRequestException('You are not following this user');
    }

    // Remove from following list
    follower.following.splice(followingIndex, 1);
    await this.userRepo.save(follower);

    return {
      success: true,
      message: 'User unfollowed successfully',
    };
  }

  /**
   * Check if user A follows user B
   */
  async isFollowing(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const follower = await this.userRepo.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower) return false;

    return follower.following.some((user) => user.id === followingId);
  }

  /**
   * Get mutual followers (users who follow each other)
   */
  async getMutualFollowers(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });

    if (!user) return [];

    // Find users who are in both lists
    const followerIds = new Set(user.followers.map((u) => u.id));
    const mutual = user.following.filter((u) => followerIds.has(u.id));

    return mutual;
  }
}