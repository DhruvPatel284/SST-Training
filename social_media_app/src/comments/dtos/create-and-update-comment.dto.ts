import { IsNumber, IsString } from "class-validator";

export class CreateAndUpdateCommentDto {
    @IsString()
    comment: string
    @IsNumber()
    postId: string
}

