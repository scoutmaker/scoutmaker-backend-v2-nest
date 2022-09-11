import { Expose } from 'class-transformer';

export class UserFootballRoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
