import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { County } from '../../../lib/common/enum/counties';

export class TeamPlayer {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '432f43r-grt5-g54-fg45t',
  })
  playerId: string;

  @IsEnum(County)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Galway',
  })
  county: County;
}

export class TeamTransferDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'h768-f687-s21-vr45v',
  })
  teamId: string;

  @IsArray()
  @Type(() => TeamPlayer)
  @IsNotEmpty()
  playersIn: TeamPlayer[];

  @IsArray()
  @Type(() => TeamPlayer)
  @IsNotEmpty()
  playersOut: TeamPlayer[];
}
