import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { AuthGuard } from '../../../../common/guards/auth.guard';
import { CreateProductDto, UpdateProductDto } from '../../dtos/request/product.dto';
import { ProductDto } from '../../dtos/response/product.dto';
import { ProductsService } from '../../products.service';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsWebController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProductList(
    @Req() request: Request,
    @Paginate() query: PaginateQuery,
    @Res() res: Response,
  ) {
    const isAjax =
      request.xhr ||
      request.headers['accept']?.includes('application/json') ||
      request.headers['x-requested-with'] === 'XMLHttpRequest';

    if (isAjax) {
      const result = await this.productsService.getProductsPaginate(query);
      console.log(result)
      return res.json(result);
    }

    return res.render('pages/product/index', {
      title: 'Product List',
      page_title: 'Product Management',
      folder: 'Product',
    });
  }

  @Get('/create')
  createProductView(@Req() req: Request, @Res() res: Response) {
    return res.render('pages/product/create', {
      title: 'Create Product',
      page_title: 'Add New Product',
      folder: 'Product',
      errors: {},
      old: null,
    });
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number, @Res() res: Response) {
    const product = await this.productsService.findOne(id);

    if (!product) return res.redirect('/products');

    return res.render('pages/product/show', {
      title: 'Product Detail',
      page_title: 'Product Information',
      folder: 'Product',
      product: plainToInstance(ProductDto, product),
    });
  }

  @Get('/:id/edit')
  async editProductById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const product = await this.productsService.findOne(id);

    if (!product) throw new NotFoundException('Product not found!');

    return res.render('pages/product/edit', {
      title: 'Edit Product',
      page_title: 'Update Product',
      folder: 'Product',
      product: plainToInstance(ProductDto, product),
      errors: req.flash('errors')[0] || {},
      old: req.flash('old')[0] || null,
    });
  }

  @Post()
  async createProduct(
    @Body()
    body: {
      name: string | undefined;
      price: string | undefined;
      stock: string | undefined;
      category: string | undefined;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const errors: any = {};

    if (!body.name || body.name.trim() === '') {
      errors.name = ['Name is required'];
    }
    if (!body.price || isNaN(Number(body.price)) || Number(body.price) <= 0) {
      errors.price = ['Valid price is required'];
    }
    if (!body.stock || isNaN(Number(body.stock)) || Number(body.stock) < 0) {
      errors.stock = ['Valid stock quantity is required'];
    }
    if (!body.category || body.category.trim() === '') {
      errors.category = ['Category is required'];
    }

    if (Object.keys(errors).length > 0) {
      req.flash('errors', errors);
      req.flash('old', body);
      return res.redirect('/products/create');
    }

    const data = {
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category,
    };

    await this.productsService.create(data);
    return res.redirect('/products');
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body()
    body: {
      name: string | undefined;
      price: string | undefined;
      stock: string | undefined;
      category: string | undefined;
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const errors: any = {};

      if (body.name !== undefined && body.name.trim() === '') {
        errors.name = ['Name should not be empty'];
      }
      if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
        errors.price = ['Valid price is required'];
      }
      if (body.stock !== undefined && (isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
        errors.stock = ['Valid stock quantity is required'];
      }
      if (body.category !== undefined && body.category.trim() === '') {
        errors.category = ['Category should not be empty'];
      }

      if (Object.keys(errors).length > 0) {
        req.flash('errors', errors);
        req.flash('old', body);
        return res.redirect(`/products/${id}/edit`);
      }

      const data: any = {};
      if (body.name) data.name = body.name;
      if (body.price) data.price = Number(body.price);
      if (body.stock) data.stock = Number(body.stock);
      if (body.category) data.category = body.category;

      const product = await this.productsService.update(id, data);

      if (!product) {
        console.error('Product not found');
        return res.redirect('/products');
      }

      return res.redirect('/products/' + id);
    } catch (error) {
      console.error(error);
      return res.redirect('/products');
    }
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number, @Res() res: Response) {
    await this.productsService.remove(id);
    return res.redirect('/products');
  }
}