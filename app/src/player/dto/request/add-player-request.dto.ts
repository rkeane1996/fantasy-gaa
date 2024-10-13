import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { County } from '../../../../lib/common/enum/counties';
import { Position } from '../../../../lib/common/enum/position';
import { ApiProperty } from '@nestjs/swagger';
import { GAAClub } from '../../../../lib/common/enum/club';
import { Status } from '../../../../lib/player/constants/status.enum';

export class CreatePlayerDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({
    example: 'www.picurl.com',
  })
  @IsString()
  @IsNotEmpty()
  profilePictureUrl: string;

  @ApiProperty({
    example: 'Galway',
  })
  @IsEnum(County)
  @IsNotEmpty()
  county: County;

  @ApiProperty({
    example: 'Carnmore',
  })
  @IsEnum(GAAClub)
  @IsNotEmpty()
  club: GAAClub;

  @ApiProperty({
    example: 'Forward',
  })
  @IsEnum(Position)
  @IsNotEmpty()
  position: Position;

  @ApiProperty({
    example: 8.5,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: Status.AVAILABLE,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
