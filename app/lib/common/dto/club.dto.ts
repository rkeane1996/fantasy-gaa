import { Club } from "lib/common/enum/club";
import { County } from "../enum/counties";
import { IsEnum } from "class-validator";

export class ClubDTO {
    @IsEnum(Club)
    clubName: Club;

    @IsEnum(County)
    county: County;
}