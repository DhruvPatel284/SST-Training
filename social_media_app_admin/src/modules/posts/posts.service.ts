import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { In, Repository } from 'typeorm';

import { Post } from './post.entity';
import { PostMedia, MediaType } from './post-media.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repo: Repository<Post>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(PostMedia)
    private mediaRepo: Repository<PostMedia>,
  ) {}

  async getPostsPaginate(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'content', 'Reviewed', 'createdAt', 'updatedAt'],
      searchableColumns: ['content', 'id'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 100,
      maxLimit: 1000,
      relations: ['user', 'comments', 'likedBy', 'media'],
      filterableColumns: {
        Reviewed: true,
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.repo.findOne({
      where: { id },
      relations: ['user', 'comments', 'likedBy', 'media'],
    });

    if (!post) throw new NotFoundException('Post not found');

    // attach virtual counts
    post.commentCount = post.comments?.length ?? 0;
    post.likeCount = post.likedBy?.length ?? 0;

    return post;
  }

  async toggleReviewed(id: number): Promise<Post> {
    const post = await this.findOne(id);
    post.Reviewed = !post.Reviewed;
    return this.repo.save(post);
  }

  async setReviewed(id: number, value: boolean): Promise<Post> {
    const post = await this.findOne(id);
    post.Reviewed = value;
    return this.repo.save(post);
  }

  async create(
    userId: string,
    content: string,
    imageFilenames: string[] = [],
    videoFilenames: string[] = [],
  ): Promise<Post> {
    const post = this.repo.create({
      content,
      user: { id: userId } as any,
      Reviewed: false,
    });

    const savedPost = await this.repo.save(post);

    // Create PostMedia entities for images
    if (imageFilenames.length > 0) {
      const images = imageFilenames.map((filename, index) =>
        this.mediaRepo.create({
          filename,
          type: MediaType.IMAGE,
          display_order: index,
          post: savedPost,
        }),
      );
      await this.mediaRepo.save(images);
    }

    // Create PostMedia entities for videos
    if (videoFilenames.length > 0) {
      const videos = videoFilenames.map((filename, index) =>
        this.mediaRepo.create({
          filename,
          type: MediaType.VIDEO,
          display_order: index,
          post: savedPost,
        }),
      );
      await this.mediaRepo.save(videos);
    }

    return this.findOne(savedPost.id);
  }

  async update(
    id: number,
    content?: string,
    imageFilenames?: string[],
    videoFilenames?: string[],
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (content !== undefined) {
      post.content = content;
      await this.repo.save(post);
    }

    // Update images if provided
    if (imageFilenames !== undefined) {
      // Remove all existing images
      await this.mediaRepo.delete({ 
        post: { id },
        type: MediaType.IMAGE 
      });

      // Add new images
      if (imageFilenames.length > 0) {
        const images = imageFilenames.map((filename, index) =>
          this.mediaRepo.create({
            filename,
            type: MediaType.IMAGE,
            display_order: index,
            post,
          }),
        );
        await this.mediaRepo.save(images);
      }
    }

    // Update videos if provided
    if (videoFilenames !== undefined) {
      // Remove all existing videos
      await this.mediaRepo.delete({ 
        post: { id },
        type: MediaType.VIDEO 
      });    

      // Add new videos
      if (videoFilenames.length > 0) {
        const videos = videoFilenames.map((filename, index) =>
          this.mediaRepo.create({
            filename,
            type: MediaType.VIDEO,
            display_order: index,
            post,
          }),
        );
        await this.mediaRepo.save(videos);
      }
    }

    return this.findOne(id);
  }
                        
  async remove(id: number): Promise<Post> {
    const post = await this.findOne(id);
    // Media will cascade delete
    return this.repo.remove(post);
  }

  async getFeedForUser(userId: string, followingIds: string[]) {
  // Combine current user ID with following IDs
  const userIds = [userId, ...followingIds];

  const posts = await this.repo.find({
    where: {
      user: { id: In(userIds) },
    },
    relations: [
      'user',
      'media',
      'likedBy',
      'comments',
      'comments.user',
    ],
    order: {
      createdAt: 'DESC',
    },
    take: 50, // Limit to 50 recent posts
  });

  // Enrich posts with counts
  return posts.map((post) => ({
    ...post,
    likeCount: post.likedBy?.length || 0,
    commentCount: post.comments?.length || 0,
    isLikedByCurrentUser: post.likedBy?.some((like) => like.id === userId) || false,
  }));
}

  /**
   * Get posts by a specific user
   * @param userId - User ID
   * @returns User's posts ordered by creation date
   */
  async getPostsByUser(userId: string) {
    const posts = await this.repo.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'media', 'likedBy', 'comments'],
      order: {
        createdAt: 'DESC',
      },
    });

    return posts.map((post) => ({
      ...post,
      likeCount: post.likedBy?.length || 0,
      commentCount: post.comments?.length || 0,
    }));
  }

  /**
   * Toggle like on a post
   * @param postId - Post ID
   * @param userId - User ID
   */
  async toggleLike(postId: number, userId: string) {
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already liked the post
    const likeIndex = post.likedBy.findIndex((like) => like.id === userId);

    if (likeIndex > -1) {
      // Unlike: remove user from likedBy
      post.likedBy.splice(likeIndex, 1);
    } else {
      // Like: add user to likedBy
      post.likedBy.push(user);
    }

    await this.repo.save(post);

    return {
      isLiked: likeIndex === -1,
      likeCount: post.likedBy.length,
    };
  }
  async getFeedPaginated(
  userId: string,
  followingIds: string[],
  page: number = 1,
  limit: number = 10,
) {
  const userIds = [userId, ...followingIds];
  const skip = (page - 1) * limit;

  // Get total count
  const totalPosts = await this.repo.count({
    where: {
      user: { id: In(userIds) },
    },
  });

  // Get paginated posts
  const posts = await this.repo.find({
    where: {
      user: { id: In(userIds) },
    },
    relations: ['user', 'media', 'likedBy', 'comments', 'comments.user'],
    order: {
      createdAt: 'DESC',
    },
    skip: skip,
    take: limit,
  });

  // Enrich posts with counts and isLiked flag
  const enrichedPosts = posts.map((post) => ({
    ...post,
    likeCount: post.likedBy?.length || 0,
    commentCount: post.comments?.length || 0,
    isLikedByCurrentUser:
      post.likedBy?.some((like) => like.id === userId) || false,
  }));

  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = page < totalPages;

  return {
    posts: enrichedPosts,
    currentPage: page,
    totalPages: totalPages,
    totalPosts: totalPosts,
    hasMore: hasMore,
  };
}
}