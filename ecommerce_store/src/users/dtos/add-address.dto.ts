import { IsEmail,IsOptional,IsString } from 'class-validator';
export class AddAddressDto {
    @IsString()
    address:string

    @IsString()
    district:string

    @IsString()
    state:string

    @IsString()
    pincode:string
    
}