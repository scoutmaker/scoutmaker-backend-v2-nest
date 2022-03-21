import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Foot } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CountryDto } from '../../countries/dto/country.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { TeamAffiliationWithoutPlayerDto } from '../../team-affiliations/dto/team-affiliation.dto';

export class PlayerDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  yearOfBirth: number;

  @Expose()
  height?: number;

  @Expose()
  weight?: number;

  @Expose()
  @ApiProperty({ enum: Foot })
  footed: Foot;

  @Expose()
  lnpId?: string;

  @Expose()
  lnpUrl?: string;

  @Expose()
  minut90id?: string;

  @Expose()
  minut90url?: string;

  @Expose()
  transfermarktId?: string;

  @Expose()
  transfermarktUrl?: string;

  @Transform(({ value }) =>
    plainToInstance(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerPositionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  primaryPosition: PlayerPositionDto;

  @Transform(({ value }) =>
    value
      ? value.map((item) =>
          plainToInstance(PlayerPositionDto, item.position, {
            excludeExtraneousValues: true,
          }),
        )
      : [],
  )
  @Expose()
  secondaryPositions: PlayerPositionDto[];

  @Transform(({ value }) =>
    plainToInstance(TeamAffiliationWithoutPlayerDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  teams: TeamAffiliationWithoutPlayerDto[];
}

export class PlayerBasicDataDto extends PickType(PlayerDto, [
  'id',
  'firstName',
  'lastName',
  'country',
  'yearOfBirth',
  'primaryPosition',
  'footed',
  'teams',
]) {}

export class PlayerBasicDataWithoutTeamsDto extends OmitType(
  PlayerBasicDataDto,
  ['teams'],
) {}
