import { OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { PlayerDto } from '../../players/dto/player.dto';
import { TeamDto } from '../../teams/dto/team.dto';

export class TeamAffiliationDto {
  @Expose()
  id: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerDto;

  @Transform(({ value }) =>
    plainToInstance(TeamDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  team: TeamDto;

  @Expose()
  startDate: Date;

  @Expose()
  endDate?: Date;
}

export class TeamAffiliationWithoutPlayerDto extends OmitType(
  TeamAffiliationDto,
  ['player'],
) {}
