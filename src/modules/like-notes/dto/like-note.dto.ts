import { Expose, plainToInstance, Transform } from 'class-transformer';

import { NoteSuperBasicDataDto } from '../../notes/dto/note.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class LikeNoteDto {
  @Transform(({ value }) =>
    plainToInstance(NoteSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  note: NoteSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;
}

export class LikeNoteBasicDataDto {
  @Expose()
  userId: number;

  @Expose()
  noteId: number;
}
