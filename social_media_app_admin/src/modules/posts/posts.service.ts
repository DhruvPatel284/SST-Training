import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  async getPostsPaginate(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'content', 'Reviewed', 'createdAt', 'updatedAt'],
      searchableColumns: ['content', 'id'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 100,
      maxLimit: 1000,
      relations: ['user', 'comments', 'likedBy'],
      filterableColumns: {
        Reviewed: true,
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.repo.findOne({
      where: { id },
      relations: ['user', 'comments', 'likedBy'],
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
}