import { Expose , Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

 @Expose()
 @Transform(({ obj }) => obj.roles?.map((role) => role.name) || [])
 roles: string[];
}
