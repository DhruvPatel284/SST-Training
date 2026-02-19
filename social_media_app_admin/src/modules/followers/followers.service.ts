import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * Returns the list of user IDs that the given user is following.
   */
  async getFollowingIds(userId: string): Promise<string[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.following.map((u) => u.id);
  }

  /**
   * Returns full following list (User objects).
   */
  async getFollowing(userId: string): Promise<User[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.following;
  }

  /**
   * Returns full followers list (User objects).
   */
  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.followers;
  }

  /**
   * Check if currentUser follows targetUser.
   */
  async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    const followingIds = await this.getFollowingIds(currentUserId);
    return followingIds.includes(targetUserId);
  }

  /**
   * Follow a user.
   */
  async follow(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId) {
      throw new Error('Cannot follow yourself');
    }

    const currentUser = await this.userRepo.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    const targetUser = await this.userRepo.findOne({
      where: { id: targetUserId },
    });

    if (!currentUser || !targetUser) throw new NotFoundException('User not found');

    const alreadyFollowing = currentUser.following.some((u) => u.id === targetUserId);
    if (!alreadyFollowing) {
      currentUser.following.push(targetUser);
      await this.userRepo.save(currentUser);
    }
  }

  /**
   * Unfollow a user.
   */
  async unfollow(currentUserId: string, targetUserId: string): Promise<void> {
    const currentUser = await this.userRepo.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) throw new NotFoundException('User not found');

    currentUser.following = currentUser.following.filter((u) => u.id !== targetUserId);
    await this.userRepo.save(currentUser);
  }

  /**
   * Get counts for a user profile.
   */
  async getCounts(userId: string): Promise<{ followersCount: number; followingCount: number }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['followers', 'following'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      followersCount: user.followers?.length ?? 0,
      followingCount: user.following?.length ?? 0,
    };
  }

  /**
   * Get suggested users to follow (users not already followed, excluding self).
   */
  async getSuggestedUsers(currentUserId: string, limit = 5): Promise<User[]> {
    const followingIds = await this.getFollowingIds(currentUserId);

    const excludeIds = [currentUserId, ...followingIds];

    const query = this.userRepo
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...excludeIds)', { excludeIds })
      .andWhere('user.emailVerified = :verified', { verified: true })
      .andWhere('user.role = :role', { role: 'user' })
      .orderBy('RAND()')
      .take(limit);

    return query.getMany();
  }
}