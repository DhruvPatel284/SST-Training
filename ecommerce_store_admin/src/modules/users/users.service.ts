import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

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

    // Delete profile image from filesystem if exists
    if (user.profile_image) {
      this.deleteProfileImageFile(user.profile_image);
    }

    return this.repo.remove(user);
  }

  async findAll() {
    return this.repo.find();
  }

  // ────────────────────────────────────────────────────────────────────
  // Profile Image Management
  // ────────────────────────────────────────────────────────────────────

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOne(userId);

    // Delete old profile image if exists
    if (user.profile_image) {
      this.deleteProfileImageFile(user.profile_image);
    }

    // Update with new image filename
    user.profile_image = file.filename;
    return this.repo.save(user);
  }

  async deleteProfileImage(userId: string): Promise<User> {
    const user = await this.findOne(userId);

    if (!user.profile_image) {
      throw new NotFoundException('No profile image to delete');
    }

    // Delete from filesystem
    this.deleteProfileImageFile(user.profile_image);

    // Remove from database
    user.profile_image = "";
    return this.repo.save(user);
  }

  private deleteProfileImageFile(filename: string): void {
    const filePath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'users',
      filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}