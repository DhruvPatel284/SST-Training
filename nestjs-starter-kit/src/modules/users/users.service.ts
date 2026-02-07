import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async getUsersPaginate(query: PaginateQuery): Promise<Paginated<User>> {
    const results = await paginate(query, this.repo, {
      sortableColumns: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'createdAt',
        'updatedAt',
      ],
      searchableColumns: [
        'name',
        'email',
        'phoneNumber',
        'id',
        'createdAt',
        'updatedAt',
      ],
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {},
    });

    return results;
  }
  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async findOneOrCreateByFirebaseUid(firebaseUid: string) {
    let user = await this.repo.findOne({ where: { firebaseUid } });
    if (!user) {
      user = this.repo.create({ firebaseUid });
      await this.repo.save(user);
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async create(attributes: Partial<User>) {
    const user = this.repo.create(attributes);
    return this.repo.save(user);
  }

  async update(id: string, attributes: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async resetPassword(user: User, password: string) {
    Object.assign(user, { password });
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.repo.softRemove(user);
  }
}
