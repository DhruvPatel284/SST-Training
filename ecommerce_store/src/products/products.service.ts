import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductDto } from './dtos/add-product.dto';
import { PaginateQuery, paginate, Paginated, FilterOperator } from 'nestjs-paginate';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepo: Repository<Product>,
        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,
    ) {}

    async addProduct(body: AddProductDto) {
        const { name, price, stock, category } = body;
        if (!name || !price || !stock || !category) {
            throw new BadRequestException('Please provide all details of product');
        }
        const product = this.productsRepo.create({ name, price, stock, category });
        return await this.productsRepo.save(product);
    }

    async updateProduct(id: number, body: Partial<AddProductDto>) {
        const product = await this.getProduct(id);
        if(!product){
            throw new NotFoundException('Product Not Found')
        }
        if(body.price == 0){
            throw new BadRequestException('This is Not Valid Price')
        }
        Object.assign(product, body);
        return await this.productsRepo.save(product);
    }

    async getProductByid(id: number, userId?: number) {
        const product = await this.getProduct(id);
        
        // If userId is provided, check if product is in cart
        if (userId) {
            const cartItem = await this.cartRepo.findOne({
                where: {
                    user: { id: userId },
                    product: { id: product.id }
                }
            });
            
            return {
                ...product,
                inCart: !!cartItem,
                cartQuantity: cartItem?.quantity || 0
            };
        }
        
        return product;
    }

    async getProduct(id: number) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async getAllProducts(userId: number, query: PaginateQuery): Promise<Paginated<Product>> {
        const qb = this.productsRepo
            .createQueryBuilder('product')
            .leftJoin('product.order_items', 'order_items')
            .loadRelationCountAndMap(
                'product.orderCount',
                'product.order_items',
            )
            .select([
                'product.id',
                'product.name',
                'product.price',
                'product.stock',
                'product.category',
            ]);

        const paginatedResult = await paginate(query, qb, {
            sortableColumns: ['id', 'price', 'stock', 'category'],
            defaultSortBy: [['id', 'DESC']],
            defaultLimit: 5,
            searchableColumns: ['name'],
            filterableColumns: {
                category: [FilterOperator.EQ],
                price: [FilterOperator.GTE, FilterOperator.LTE]
            },
        });

        // Get all product IDs from the current page
        const productIds = paginatedResult.data.map(product => product.id);

        // Fetch cart items for this user and these products in a single query
        const cartItems = await this.cartRepo.find({
            where: {
                user: { id: userId },
                product: { id: In(productIds) }
            },
            relations: ['product']
        });

        // Create a map of productId -> cart item for quick lookup
        const cartMap = new Map(
            cartItems.map(item => [item.product.id, item])
        );

        // Add inCart and cartQuantity to each product
        const productsWithCartStatus = paginatedResult.data.map(product => {
            const cartItem = cartMap.get(product.id);
            return {
                ...product,
                inCart: !!cartItem,
                cartQuantity: cartItem?.quantity || 0
            };
        });

        return {
            ...paginatedResult,
            data: productsWithCartStatus
        };
    }
}