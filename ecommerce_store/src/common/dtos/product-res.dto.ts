import { Expose } from 'class-transformer';

export class ProductResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    stock: number;

    @Expose()
    category: string;

    @Expose()
    orderCount: number;

    @Expose()
    inCart: boolean;

    @Expose()
    cartQuantity: number;
}