import { OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { TeamBasicDataDto } from '../../teams/dto/team.dto';

export class TeamAffiliationDto {
  @Expose()
  id: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataWithoutTeamsDto;

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
