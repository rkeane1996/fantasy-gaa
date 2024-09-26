import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';

export class StartStopGameweekDto {
  @ApiProperty({
    example: 2,
    description: 'The gameweek number',
  })
  @IsNumber()
  gameweekNumber: number;

  @ApiProperty({
    example: true,
    description: 'Is the gameweek starting or finishing',
  })
  @IsBoolean()
  isActive: boolean;
}
