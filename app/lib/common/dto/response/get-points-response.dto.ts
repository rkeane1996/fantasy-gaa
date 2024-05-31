import { ApiProperty } from "@nestjs/swagger";
import { IGameweekPoints } from "lib/common/interface/gameweek-points";

export class GetPointsResponseDto {

    constructor(totalPoints: number, gameweekPoints: IGameweekPoints[]){
        this.gameweekPoints = gameweekPoints;
        this.totalPoints = totalPoints
    }
    
    @ApiProperty({
        example: 23
    })
    totalPoints: number;

    @ApiProperty({
        example: [{gameweek: 2, gameweekPoints: 23}]
      })
    gameweekPoints: IGameweekPoints[]
}