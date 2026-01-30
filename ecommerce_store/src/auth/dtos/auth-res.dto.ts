import { Expose } from 'class-transformer';
import { UserRole } from 'src/users/user.entity';

export class AuthResDto {
  @Expose()
  accessToken : string
  @Expose()
  name :string
  @Expose()
  email:string
  @Expose()
  role:UserRole
}
