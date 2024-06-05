import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameweekPointsDTO } from 'lib/common/dto/request/gameweek-points.dto';
import { ClubDTO } from 'lib/common/dto/club.dto';
import { County } from 'lib/common/enum/counties';
import { Position } from 'src/player/enums/position';
import { Player } from '../../schema/player.schema';
import { ApiProperty } from '@nestjs/swagger';

export class PlayerDTO extends Player {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({
    example: 'Galway',
  })
  @IsEnum(County)
  @IsNotEmpty()
  county: County;

  @ApiProperty({
    example: 'Carnmore',
  })
  @IsObject()
  @IsNotEmpty()
  club: ClubDTO;

  @ApiProperty({
    example: 'Forward',
  })
  @IsEnum(Position)
  @IsNotEmpty()
  position: Position;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  totalPoints: number;

  @IsArray()
  @ApiProperty({
    example: [
      { gameweek: 5, gameweekPoints: 10 },
      { gameweek: 6, gameweekPoints: 100 },
      { gameweek: 7, gameweekPoints: 54 },
    ],
  })
  @IsOptional()
  gameweekPoints: GameweekPointsDTO[];
}
