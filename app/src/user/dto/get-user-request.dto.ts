import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class GetUserRequestDto {
  @ApiProperty({
    example: ['r438-43rtfv-6yjh6-g54y,fbjfvk5fr-f4fgege5g'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  userIds: string[];
}
