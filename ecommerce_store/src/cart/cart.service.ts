import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepo : Repository<Cart>,
        private usersService : UsersService,
        @Inject(forwardRef(() => ProductsService))
        private productsService: ProductsService,
    ){}

    async addToCart(productId:number , userId:number) {
        const user = await this.usersService.findOne(userId);
        if(!user){
            throw new NotFoundException('User Not Found');
        }
        const product = await this.productsService.getProduct(productId);
        if(!product){
            throw new NotFoundException('Product Not Found');
        }
        if(product.stock < 1){
            throw new NotFoundException('Product is Out Of Stock');
        }
        const cart_check = await this.cartRepo.findOne({
            where:{
                user:{
                    id:userId
                },
                product:{
                    id:productId
                }
            }
        })
        if(cart_check){
            throw new BadRequestException('This Product is already exist in Cart')
        }
        const cart_item = this.cartRepo.create({user,product,quantity:1});
        return await this.cartRepo.save(cart_item);
    }

    async removeFromCart(id:number) {
        const cart_item = await this.findCartItemByid(id);
        if(!cart_item){
            throw new NotFoundException('Cart Item Not Found');
        }
        return await this.cartRepo.remove(cart_item);
    }

    async setQuantity(id:number,quantity:number) {
        if(quantity == 0){
            throw new BadRequestException("can't set quantity to zero")
        }
        const cart_item = await this.findCartItemByid(id);
        if(!cart_item){
            throw new NotFoundException('Cart Item Not Found');
        }
        if(cart_item.product.stock < quantity){
            throw new BadRequestException('This Quantity Make Product Out Of Stock')
        }
        cart_item.quantity = quantity
        return await this.cartRepo.save(cart_item);
    }

    async findCartItemByid(id:number){
        if(!id){
            return null;
        }
        const cart_item = await this.cartRepo.findOne({
            where:{id},
            relations:{
                product:true
            }
        });
        if(!cart_item){
            throw new NotFoundException('Cart Item Not Found');
        }
        return cart_item;
    }

    async getFullCart(userId:number) { 
        const cart = await this.cartRepo.find({
            where:{
                user:{
                    id:userId
                }
            },
            relations:{
                product:true
            }
        })
        return cart;
    }
}
