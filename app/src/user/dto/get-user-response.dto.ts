import { ApiProperty } from '@nestjs/swagger';

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
}
