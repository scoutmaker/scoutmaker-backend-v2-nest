import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Foot } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CountryDto } from '../../countries/dto/country.dto';
import { LikePlayerBasicDataDto } from '../../like-players/dto/like-player.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { PlayerRoleBasicDataDto } from '../../player-roles/dto/player-role.dto';
import { TeamAffiliationWithoutPlayerDto } from '../../team-affiliations/dto/team-affiliation.dto';

class Count {
  notes: number;
  reports: number;
}

export class PlayerDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  slug: string;

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

  @Expose()
  inStatUrl?: string;

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

  @Transform(({ value }) =>
    plainToInstance(LikePlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  likes: LikePlayerBasicDataDto[];

  @Expose()
  averagePercentageRating: number;

  @Transform(({ value }) =>
    plainToInstance(PlayerRoleBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  role: PlayerRoleBasicDataDto;

  @Expose()
  _count: Count;
}

export class PlayerBasicDataDto extends PickType(PlayerDto, [
  'id',
  'firstName',
  'lastName',
  'slug',
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

export class PlayerSuperBasicDataDto extends PickType(PlayerDto, [
  'id',
  'firstName',
  'lastName',
  'slug',
]) {}
