import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateGameweekDto {
  @ApiProperty({
    example: 2,
    description:
      'What is the number of the gameweek, is it the 1st, 2nd, 3rd gameweek',
  })
  @IsNumber()
  @IsNotEmpty()
  gameweekNumber: number;

  @ApiProperty({
    example: ['matchid-1', 'matchid-2', 'matchid-3'],
    description: 'The matches that are link to the gameweek',
  })
  @IsArray()
  matches: string[];

  @ApiProperty({
    example: new Date(),
    description:
      'The deadline to which users can make transfers before then gameweek starts',
  })
  @IsDateString()
  @IsNotEmpty()
  transferDeadline: Date;
}
