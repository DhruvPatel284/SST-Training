import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAndUpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
