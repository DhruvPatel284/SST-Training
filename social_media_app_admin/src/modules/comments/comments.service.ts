import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create a new comment
   */
  async create(data: { postId: number; userId: string; content: string }) {
    const post = await this.postRepo.findOne({
      where: { id: data.postId },
      relations: ['user'],  // ADD relation to get post owner
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const comment = this.repo.create({
      comment: data.content,
      post: post,
      user: user,
    });

    const savedComment = await this.repo.save(comment);

    // CREATE NOTIFICATION (ADD THIS)
    try {
      await this.notificationsService.createCommentNotification(
        savedComment.id,
        data.postId,
        data.userId,
      );
    } catch (error) {
      console.error('Failed to create comment notification:', error);
    }

    return savedComment;
  }

  /**
   * Find comment with user information
   */
  async findOneWithUser(commentId: number) {
    return await this.repo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
  }

  /**
   * Get all comments for a post
   */
  async getCommentsForPost(postId: number) {
    return await this.repo.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Delete a comment
   */
  async remove(commentId: number, userId: string) {
    const comment = await this.repo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new Error('You can only delete your own comments');
    }

    return await this.repo.remove(comment);
  }
}