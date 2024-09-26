import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetGameweekQueryDto {
  @ApiProperty({
    example: 2,
    description: 'The gameweek number',
  })
  @IsNumber()
  gameweekNumber: number;
}
