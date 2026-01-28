import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, {
    message: 'phone_no must be exactly 10 digits',
  })
  phone_no?: string;
}
