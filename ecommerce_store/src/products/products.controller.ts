import { 
    Controller, 
    UseGuards,
    Request,
    Body,
    Get, 
    Post,
    Patch, 
    Param
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt-auth.guard';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Product } from './product.entity';


@Controller('products')
@UseGuards(PassportJwtAuthGuard)
export class ProductsController {
    constructor(
        private productsService :ProductsService,
    ){}

    @UseGuards(AdminAuthGuard)
    @Post()
    async add(@Body() body) {
        return await this.productsService.addProduct(body);
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    async update(@Param('id') id, @Body() body) {
        return await this.productsService.updateProduct(parseInt(id),body);
    }

    @Get(':id')
    async get(@Param('id') id){
        return await this.productsService.getProductByid(id);
    }

    @Get()
    async getAll(@Paginate() query:PaginateQuery):Promise<Paginated<Product>> {
        return await this.productsService.getAllProducts(query);
    }

}
