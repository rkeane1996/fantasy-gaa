import { ApiProperty } from '@nestjs/swagger';

export class GetTeamResponseDto {
  @ApiProperty({
    example: '54g-r43f-43fg-43f',
  })
  teamId: string;

  @ApiProperty({
    example: '543f54-t54g6-43fg-54g54',
  })
  userId: string;

  @ApiProperty({
    example: 'Best Team Ever',
  })
  teamName: string;

  @ApiProperty({
    example: ['123f-53bf-4f74', '43bf-fdu5-fg54'],
  })
  players: string[];
}
