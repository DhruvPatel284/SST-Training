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
    
    // Extract price filters before cleaning
    let minPrice: number | null = null;
    let maxPrice: number | null = null;
    
    // Clean up empty filter values
    if (query.filter && typeof query.filter === 'object') {
        const filterKeys = Object.keys(query.filter);
        
        for (const key of filterKeys) {
            if (!query.filter) break;
            
            const value = query.filter[key];
            
            // Extract and remove price filters (we'll apply them manually)
            if (key === 'price.$gte' && value && value !== '') {
                const numValue = parseFloat(Array.isArray(value) ? value[0] : value);
                if (!isNaN(numValue) && numValue > 0) {
                    minPrice = numValue;
                }
                delete query.filter[key];
                continue;
            }
            
            if (key === 'price.$lte' && value && value !== '') {
                const numValue = parseFloat(Array.isArray(value) ? value[0] : value);
                if (!isNaN(numValue) && numValue > 0) {
                    maxPrice = numValue;
                }
                delete query.filter[key];
                continue;
            }
            
            // Remove empty, undefined, or null values
            if (value === '' || value === undefined || value === null) {
                delete query.filter[key];
                continue;
            }
        }
        
        // If filter object is now empty, remove it entirely
        if (query.filter && Object.keys(query.filter).length === 0) {
            delete query.filter;
        }
    }
    
    if (minPrice !== null) {
        qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== null) {
        qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    
    const paginatedResult = await paginate(query, qb, {
        sortableColumns: ['id', 'price', 'stock', 'category'],
        defaultSortBy: [['id', 'DESC']],
        defaultLimit: 5,
        searchableColumns: ['name'],
        filterableColumns: {
            category: [FilterOperator.EQ],
        },
    });

    // Handle empty results
    if (!paginatedResult.data || paginatedResult.data.length === 0) {
        return {
            ...paginatedResult,
            data: []
        };
    }

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