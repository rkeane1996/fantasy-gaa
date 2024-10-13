import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../../../lib/player/constants/status.enum';

export class UpdatePlayerStatusDto {
  @ApiProperty({
    example: 'GTR5667-BR66Y-BYRH6-GRD',
  })
  @IsString()
  @IsNotEmpty()
  playerId: string;

  @ApiProperty({
    example: Status.AVAILABLE,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
