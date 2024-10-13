import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerPriceDto {
  @ApiProperty({
    example: 'GTR5667-BR66Y-BYRH6-GRD',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    example: 8.5,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
