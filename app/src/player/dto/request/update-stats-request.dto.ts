import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePlayerStatsDto {
  @ApiProperty({
    example: 'fre-435g4-5gr',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  goals: number;

  @ApiProperty({
    example: 34,
  })
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  yellowCards: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  redCards: number;
}
