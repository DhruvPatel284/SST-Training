import { IsEmail,IsNumber,IsOptional,IsString } from 'class-validator';
export class AddProductDto {
    @IsString()
    name:string

    @IsNumber()
    price:number

    @IsNumber()
    stock:number

    @IsString()
    category:string
}