import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(ProductImage)
    private imageRepo: Repository<ProductImage>,
  ) {}

  async getProductsPaginate(query: PaginateQuery): Promise<Paginated<Product>> {
    const queryBuilder = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('images.display_order', 'ASC');

    const results = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'name', 'price', 'stock', 'category'],
      searchableColumns: ['name', 'category'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 10,
      maxLimit: 1000,
      filterableColumns: {
        category: true,
      },
    });

    return results;
  }

  async findAll() {
    return this.repo.find({ relations: ['images'] });
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['images'],
      order: { images: { display_order: 'ASC' } },
    });
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

    // Delete all product images from filesystem
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        this.deleteImageFile(image.filename);
      }
    }

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

  // ────────────────────────────────────────────────────────────────────
  // Image Management
  // ────────────────────────────────────────────────────────────────────

  async addImages(
    productId: number,
    files: Express.Multer.File[],
  ): Promise<ProductImage[]> {
    const product = await this.findOne(productId);

    // Check current image count
    const currentCount = product.images?.length || 0;
    const newCount = files.length;

    if (currentCount + newCount > 5) {
      // Delete uploaded files since we're rejecting them
      files.forEach((file) => this.deleteImageFile(file.filename));
      throw new BadRequestException(
        `Cannot add ${newCount} images. Product already has ${currentCount} images. Maximum is 5.`,
      );
    }

    const images: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const image = this.imageRepo.create({
        filename: files[i].filename,
        display_order: currentCount + i,
        product: product,
      });
      images.push(await this.imageRepo.save(image));
    }

    return images;
  }

  async deleteImage(imageId: number): Promise<void> {
    const image = await this.imageRepo.findOne({
      where: { id: imageId },
      relations: ['product'],
    });

    if (!image) throw new NotFoundException('Image not found');

    // Delete from filesystem
    this.deleteImageFile(image.filename);

    // Delete from database
    await this.imageRepo.remove(image);

    // Reorder remaining images
    await this.reorderImages(image.product.id);
  }

  async reorderImages(productId: number): Promise<void> {
    const product = await this.findOne(productId);
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        product.images[i].display_order = i;
        await this.imageRepo.save(product.images[i]);
      }
    }
  }

  private deleteImageFile(filename: string): void {
    const filePath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'products',
      filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getImage(imageId: number): Promise<ProductImage> {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }
}