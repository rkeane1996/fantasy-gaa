import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ClubDTO } from '../../../../lib/common/dto/club.dto';
import { County } from '../../../../lib/common/enum/counties';
import { Position } from '../../../../lib/common/enum/position';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerInfoDTO {
  @ApiProperty({
    example: 'fre-435g4-5gr',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

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
    example: 'Available',
  })
  @IsNumber()
  @IsNotEmpty()
  availability: string;
}
