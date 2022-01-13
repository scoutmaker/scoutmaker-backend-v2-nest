import { IsBoolean } from 'class-validator';

export class ToggleIsActiveDto {
  @IsBoolean()
  isActive: boolean;
}
