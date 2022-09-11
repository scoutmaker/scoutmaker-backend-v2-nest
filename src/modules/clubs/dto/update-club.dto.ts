import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateClubDto } from './create-club.dto';

export class UpdateClubDto extends PartialType(
  OmitType(CreateClubDto, ['id']),
) {}
