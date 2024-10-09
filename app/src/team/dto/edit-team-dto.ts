import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditTeamInfoDto {
  @ApiProperty({ example: '54g-r43f-43fg-43f' })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({ example: 'TestTeam' })
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @IsNotEmpty()
  jerseyColour: string;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsNotEmpty()
  shortsColour: string;
}
