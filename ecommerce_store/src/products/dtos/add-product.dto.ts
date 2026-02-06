import { Type } from 'class-transformer';
import { IsEmail,IsNumber,IsOptional,IsString } from 'class-validator';
export class AddProductDto {
    @IsString()
    name:string
    
    @Type(() => Number)
    @IsNumber()
    price:number

    @Type(() => Number)
    @IsNumber()
    stock:number

    @IsString()
    category:string
}