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
import { ResponseMessage } from '../decorators/response-message.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductResponseDto } from 'src/common/dtos/product-res.dto';


@Controller('products')
@UseGuards(PassportJwtAuthGuard)
export class ProductsController {
    constructor(
        private productsService :ProductsService,
    ){}

    @UseGuards(AdminAuthGuard)
    @Post()
    @ResponseMessage('Product Added Successfully')
    @Serialize(ProductResponseDto)
    async add(@Body() body) {
        return await this.productsService.addProduct(body);
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    @ResponseMessage('Product Updated Successfully')
    @Serialize(ProductResponseDto)
    async update(@Param('id') id, @Body() body) {
        return await this.productsService.updateProduct(parseInt(id),body);
    }

    @Get(':id')
    @ResponseMessage('Product Retrivied Successfully')
    @Serialize(ProductResponseDto)
    async get(@Param('id') id){
        return await this.productsService.getProductByid(id);
    }

    @Get()
    @ResponseMessage('Products Retrivied Successfully')
    async getAll(@Request() req,@Paginate() query:PaginateQuery):Promise<Paginated<Product>> {
        return await this.productsService.getAllProducts(req.user.userId,query);
    }

}
