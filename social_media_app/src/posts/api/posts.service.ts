import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { PostMedia, MediaType } from '../post-media.entity';
import { CreateAndUpdatePostDto } from './dtos/create-update-post.dto';
import { UsersService } from 'src/users/users.service';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { validateFileSize } from '../config/multer.config';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepo: Repository<Post>,
        @InjectRepository(PostMedia)
        private postMediaRepo: Repository<PostMedia>,
        private usersService: UsersService
    ) {}

    async createPost(
        userId: number,
        { content }: CreateAndUpdatePostDto,
        files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
    ) {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Validate file sizes
        if (files?.images) {
            files.images.forEach(validateFileSize);
        }
        if (files?.videos) {
            files.videos.forEach(validateFileSize);
        }

        const post = this.postsRepo.create({
            content,
            user,
        });

        const savedPost = await this.postsRepo.save(post);

        // Save media files
        const mediaEntities: PostMedia[] = [];

        // Process images
        if (files?.images) {
            files.images.forEach((file, index) => {
                const media = this.postMediaRepo.create({
                    filename: file.filename,
                    type: MediaType.IMAGE,
                    display_order: index,
                    post: savedPost,
                });
                mediaEntities.push(media);
            });
        }

        // Process videos
        if (files?.videos) {
            const videoStartIndex = files.images?.length || 0;
            files.videos.forEach((file, index) => {
                const media = this.postMediaRepo.create({
                    filename: file.filename,
                    type: MediaType.VIDEO,
                    display_order: videoStartIndex + index,
                    post: savedPost,
                });
                mediaEntities.push(media);
            });
        }

        if (mediaEntities.length > 0) {
            await this.postMediaRepo.save(mediaEntities);
        }

        return savedPost;
    }

    async getPost(id: number) {
        if (!id) {
            return null;
        }
        return await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,
                comments: true,
                media: true,
            },
        });
    }

    async getPostByid(userId: number, id: number) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,
                likedBy: true,
                comments: {
                    user: true,
                },
                media: true,
            },
        });

        if (!post) {
            throw new NotFoundException('Post Not Found');
        }

        // ===== LIKE COUNT =====
        post.likeCount = post.likedBy.length;

        // ===== IS LIKED BY CURRENT USER =====
        post.isLikedByCurrentUser = post.likedBy.some(
            (user) => user.id === userId,
        );

        // ===== COMMENT COUNT =====
        post.commentCount = post.comments.length;

        return post;
    }

    async getAllPosts(userId: number, query: PaginateQuery): Promise<Paginated<Post>> {
        const qb = this.postsRepo
            .createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .leftJoin('post.media', 'media')
            .where('post.Reviewed = true')
            .loadRelationCountAndMap(
                'post.commentCount',
                'post.comments',
            )
            .loadRelationCountAndMap(
                'post.likeCount',
                'post.likedBy',
            )
            .select([
                'post.id',
                'post.content',
                'post.createdAt',
                'post.updatedAt',
                'user.id',
                'user.name',
                'user.email',
                'media.id',
                'media.filename',
                'media.type',
                'media.display_order',
            ]);

        return paginate(query, qb, {
            sortableColumns: ['id', 'createdAt', 'updatedAt'],
            defaultSortBy: [['id', 'DESC']],
            defaultLimit: 10,
            searchableColumns: ['content'],
        });
    }

    async updatePost(
        userId: number,
        id: number,
        body: CreateAndUpdatePostDto,
        files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
    ) {
        const post = await this.postsRepo.findOne({
            where: { id },
            relations: {
                user: true,
                media: true,
            },
        });

        if (!post) {
            throw new NotFoundException('Post Not Found');
        }

        if (userId != post.user.id) {
            throw new UnauthorizedException('Only Creator can Update the Post');
        }

        // Validate file sizes
        if (files?.images) {
            files.images.forEach(validateFileSize);
        }
        if (files?.videos) {
            files.videos.forEach(validateFileSize);
        }

        post.content = body.content;
        const updatedPost = await this.postsRepo.save(post);

        // Add new media files if provided
        const mediaEntities: PostMedia[] = [];
        const existingMediaCount = post.media.length;

        // Process images
        if (files?.images) {
            files.images.forEach((file, index) => {
                const media = this.postMediaRepo.create({
                    filename: file.filename,
                    type: MediaType.IMAGE,
                    display_order: existingMediaCount + index,
                    post: updatedPost,
                });
                mediaEntities.push(media);
            });
        }

        // Process videos
        if (files?.videos) {
            const videoStartIndex = existingMediaCount + (files.images?.length || 0);
            files.videos.forEach((file, index) => {
                const media = this.postMediaRepo.create({
                    filename: file.filename,
                    type: MediaType.VIDEO,
                    display_order: videoStartIndex + index,
                    post: updatedPost,
                });
                mediaEntities.push(media);
            });
        }

        if (mediaEntities.length > 0) {
            await this.postMediaRepo.save(mediaEntities);
        }

        return updatedPost;
    }

    async deletePostMedia(userId: number, postId: number, mediaId: number) {
        const post = await this.postsRepo.findOne({
            where: { id: postId },
            relations: {
                user: true,
                media: true,
            },
        });

        if (!post) {
            throw new NotFoundException('Post Not Found');
        }

        if (userId != post.user.id) {
            throw new UnauthorizedException('Only Creator can Delete Media');
        }

        const media = await this.postMediaRepo.findOne({
            where: { id: mediaId, post: { id: postId } },
        });

        if (!media) {
            throw new NotFoundException('Media Not Found');
        }

        // Delete file from filesystem
        const filePath = join(process.cwd(), 'public', 'uploads', 'posts', media.filename);
        try {
            await unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
            // Continue anyway - we still want to delete the database record
        }

        // Delete from database
        await this.postMediaRepo.remove(media);

        return { message: 'Media deleted successfully' };
    }
}