import { Expose } from 'class-transformer';

export class AuthResDto {
  @Expose()
  accessToken : string
}
