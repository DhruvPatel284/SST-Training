import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Console } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }

  async addRoleToUser(userId: number, roleName: string) {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User not found');

    let role = await this.roleRepo.findOne({ where: { name: roleName } });

    if (!role) {
      role = this.roleRepo.create({ name: roleName });
      await this.roleRepo.save(role);
    }

    const alreadyHasRole = user.roles.some((r) => r.name === roleName);
    if (!alreadyHasRole) {
      user.roles.push(role);
      await this.repo.save(user);
    }
    console.log(user);
    return user;
  }

  async getUserWithRoles(userId: number) {
    const response = this.repo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    return response;
  }
}
