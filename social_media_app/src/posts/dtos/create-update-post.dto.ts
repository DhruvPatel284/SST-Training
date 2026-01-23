import { IsString } from "class-validator";

export class CreateAndUpdatePostDto {
    @IsString()
    content: string
}