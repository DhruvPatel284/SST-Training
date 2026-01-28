import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../users/user.entity';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name?: string;

  @Expose()
  email: string;

  @Expose()
  phone_no?: string;

  @Expose()
  role: UserRole;
}
