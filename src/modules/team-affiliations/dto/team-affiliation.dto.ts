import { OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';

export class TeamAffiliationDto {
  @Expose()
  id: number;

  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(TeamBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamBasicDataDto;

  @Expose()
  startDate: Date;

  @Expose()
  endDate?: Date;
}

export class TeamAffiliationWithoutPlayerDto extends OmitType(
  TeamAffiliationDto,
  ['player'],
) {}
