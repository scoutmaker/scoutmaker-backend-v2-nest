import { Expose, plainToInstance, Transform } from 'class-transformer';
import { ClubDto } from '../../clubs/dto/club.dto';

export class TeamDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  competitions: any;

  @Expose()
  minut90url?: string;

  @Expose()
  transfermarktUrl?: string;

  @Expose()
  lnpId?: string;

  @Transform(({ value }) =>
    plainToInstance(ClubDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  club: ClubDto;
}
