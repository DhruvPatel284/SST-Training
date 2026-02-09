import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';

import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async getProductsPaginate(query: PaginateQuery): Promise<Paginated<Product>> {
    const results = await paginate(query, this.repo, {
      sortableColumns: [
        'id',
        'name',
        'price',
        'stock',
        'category',
      ],
      searchableColumns: [
        'name',
        'category',
      ],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        category: true,
      },
    });

    return results;
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(attributes: Partial<Product>) {
    const product = this.repo.create(attributes);
    return this.repo.save(product);
  }

  async update(id: number, attributes: Partial<Product>) {
    const product = await this.findOne(id);
    Object.assign(product, attributes);
    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }

  async decrementStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new NotFoundException('Insufficient stock');
    }
    product.stock -= quantity;
    return this.repo.save(product);
  }

  async incrementStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    product.stock += quantity;
    return this.repo.save(product);
  }
}