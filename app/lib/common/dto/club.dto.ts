import { IsEnum } from 'class-validator';
import { County } from '../enum/counties';
import { GAAClub } from '../enum/club';

export class ClubDTO {
  @IsEnum(GAAClub)
  clubName: GAAClub;

  @IsEnum(County)
  county: County;
}
