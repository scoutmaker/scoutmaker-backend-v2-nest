import { Expose } from 'class-transformer';

export class UserFootballRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
