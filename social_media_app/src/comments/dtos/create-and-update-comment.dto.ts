import { IsNumber, IsString } from "class-validator";

export class CreateAndUpdateCommentDto {
    @IsString()
    comment: string
}

