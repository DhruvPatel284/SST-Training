import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';


@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(User)
    private usersRepo : Repository<User>,
    private dataSource: DataSource,
  ) {}

    async toggleLike(userId: number, postId: number) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userRepo = queryRunner.manager.getRepository(User);
            const postRepo = queryRunner.manager.getRepository(Post);

            const user = await userRepo.findOne({
                where: { id: userId },
                relations: ['likes'],
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = await postRepo.findOne({
                where: { id: postId },
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            const alreadyLiked = user.likes.some(
                (likedPost) => likedPost.id === postId,
            );

            if (alreadyLiked) {
                user.likes = user.likes.filter(
                (likedPost) => likedPost.id !== postId,
                );
            } else {
                user.likes.push(post);
            }

            await userRepo.save(user);

            await queryRunner.commitTransaction();

            return {
                liked: !alreadyLiked,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                 'Failed to toggle like',
            );
        } finally {
            await queryRunner.release();
        }
    }

  async getUsersWhoLikedPost(postId: number,query: PaginateQuery): Promise<Paginated<User>> {
        const qb = this.usersRepo
            .createQueryBuilder('user')
            .innerJoin(
            'user.likes',
            'post',
            'post.id = :postId',
            { postId },
            )
            .select([
            'user.id',
            'user.name',
            'user.email',
            ]);

        return paginate(query, qb, {
            sortableColumns: ['id', 'name'],
            defaultSortBy: [['id', 'DESC']],
            defaultLimit: 5,
        });
    }

}
