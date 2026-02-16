import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { Post } from './post.entity';
import { PostMedia, MediaType } from './post-media.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private repo: Repository<Post>,
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
}