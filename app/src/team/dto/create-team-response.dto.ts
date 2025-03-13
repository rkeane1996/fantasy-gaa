import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamResponseDTO {
  constructor(id?: string) {
    this.id = id;
  }
  @ApiProperty({
    example: '234-fgre43rg5-43g',
  })
  id: string;
}
