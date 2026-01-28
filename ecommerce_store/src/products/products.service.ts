import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { PaginateQuery, paginate, Paginated, FilterOperator } from 'nestjs-paginate';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepo : Repository<Product>,
    ){}

    async addProduct(body:AddProductDto) {
        const {name, price, stock, category} = body;
        if(!name || !price || !price || !category){
            throw new BadRequestException('Please Provide All Details of Product')
        }
        const product = this.productsRepo.create({name, price, stock, category});
        return await this.productsRepo.save(product);
    }

    async updateProduct(id:number, body : Partial<AddProductDto>) {
        const product = await this.getProduct(id);
        Object.assign(product,body);
        return await this.productsRepo.save(product);
    }

    async getProductByid(id:number){
        return await this.getProduct(id);
    }

    async getProduct(id:number){
        const product = await this.productsRepo.findOne({where:{id}});
        if(!product){
            throw new NotFoundException('Product Not Found');
        }
        return product;
    }

    async getAllProducts(query: PaginateQuery): Promise<Paginated<Product>> {
        const qb = this.productsRepo
            .createQueryBuilder('product')
            .leftJoin('product.order_items', 'order_items')
            .loadRelationCountAndMap(
                'product.orderCount',
                'product.order_items.quantity',
            )
            .select([
                'product.id',
                'product.name',
                'product.price',
                'product.stock',
                'product.category',
            ]);
        
        return paginate(query, qb, {
            sortableColumns: ['id', 'price', 'stock', 'category'],
            defaultSortBy: [['id', 'DESC']],
            defaultLimit: 5,
            searchableColumns: ['name'],
            filterableColumns: {
                category:[FilterOperator.EQ],
                price:[FilterOperator.GTE,FilterOperator.LTE]
            },
        });
    }
}
