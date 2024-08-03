import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddPointTypes {
  @ApiProperty({
    example: 'POINT_SCORED',
  })
  @IsString()
  @IsNotEmpty()
  pointType: string;

  @ApiProperty({
    example: 'Scoring a point',
  })
  @IsString()
  @IsNotEmpty()
  pointDescription: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  pointValue: number;
}
