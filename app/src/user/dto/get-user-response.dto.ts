import { ApiProperty } from '@nestjs/swagger';
import { ClubDTO } from '../../../lib/common/dto/club.dto';
import { GAAClub } from '../../../lib/common/enum/club';
import { County } from '../../../lib/common/enum/counties';

export class GetUserResponseDto {
  @ApiProperty({
    example: 'r438-43rtfv-6yjh6-g54y',
  })
  userId: string;

  @ApiProperty({
    example: 'Ronan',
  })
  firstName: string;

  @ApiProperty({
    example: 'Keane',
  })
  lastName: string;

  @ApiProperty({
    example: 'test@testing.com',
  })
  email: string;

  @ApiProperty({
    example: {
      clubName: GAAClub.BallyhaleShamrocks,
      county: County.Kilkenny,
    },
  })
  club: ClubDTO;
}
