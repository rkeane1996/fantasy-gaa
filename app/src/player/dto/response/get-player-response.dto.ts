import { ApiProperty } from '@nestjs/swagger';
import { ClubDTO } from '../../../../lib/common/dto/club.dto';
import { County } from '../../../../lib/common/enum/counties';
import { Position } from '../../enums/position';

export class FindPlayerResponseDTO {
  @ApiProperty({
    example: '100-23-23frwe-43v',
  })
  playerId: string;

  @ApiProperty({
    example: 'Ronan Keane',
  })
  playerName: string;
  @ApiProperty({
    example: 'Galway',
  })
  county: County;

  @ApiProperty({
    example: 'Defender',
  })
  position: Position;

  @ApiProperty({
    example: 'Carnmore',
  })
  club: ClubDTO;
}
