import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ClubDTO } from '../../../../lib/common/dto/club.dto';
import { County } from '../../../../lib/common/enum/counties';
import { Position } from '../../enums/position';
import { ApiProperty } from '@nestjs/swagger';

export class PlayerDTO {
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
}
