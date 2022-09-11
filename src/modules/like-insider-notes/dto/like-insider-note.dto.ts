import { Expose, plainToInstance, Transform } from 'class-transformer';

import { InsiderNoteSuperBasicDataDto } from '../../insider-notes/dto/insider-note.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class LikeInsiderNoteDto {
  @Transform(({ value }) =>
    plainToInstance(InsiderNoteSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  insiderNote: InsiderNoteSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;
}

export class LikeInsiderNoteBasicDataDto {
  @Expose()
  userId: string;

  @Expose()
  insiderNoteId: string;
}
