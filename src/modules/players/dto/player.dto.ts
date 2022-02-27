import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Foot } from '@prisma/client';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { CountryDto } from 'src/modules/countries/dto/country.dto';
import { PlayerPositionDto } from 'src/modules/player-positions/dto/player-position.dto';
import { ClubDto } from '../../clubs/dto/club.dto';

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
    value.map((item) =>
      plainToInstance(PlayerPositionDto, item.position, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  @Expose()
  secondaryPositions: PlayerPositionDto[];

  // TODO: team affiliations
}
