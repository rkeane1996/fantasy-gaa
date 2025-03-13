import { CreatePlayerRequest } from "../client/player/dto/create-player.dto";
import { FindPlayerResponse } from "../client/player/dto/get-player-response";
import { UpdatePlayerPriceDto } from "../client/player/dto/update-player-price.dto";
import { UpdatePlayerStatusDto } from "../client/player/dto/update-player-status.dto";
import { CreateTeamResponseDTO } from "../client/team/dto/create-team-response.dto";
import { CreateTeamRequest } from "../client/team/dto/create-team.dto";
import { IPlayer } from "../db/mongodb/types/player.type";
import { Status } from "../db/mongodb/types/position.type";
import { ITeam } from "../db/mongodb/types/team.type";
import { IUser, IUserResponseType } from "../db/mongodb/types/user.type";
import { asVar } from "../utils/data-utils/argument";
import { APIResponse } from "../utils/service-client/api-response";

export class World {
    [key: string]: unknown;
    
    
    //User Component tests
    users: IUser[];
    team: ITeam;
    token: string;
    clubName: string;
    getUserResponse: APIResponse<IUserResponseType[]> | undefined;
    getUserByClubResponse: APIResponse<IUserResponseType[]> | undefined;

    //Player Component tests
    createPlayerRequest: CreatePlayerRequest
    createPlayerResponse: APIResponse<FindPlayerResponse>;
    players: IPlayer[]=[];
    getPlayersParams: string[];
    getPlayerResponse: APIResponse<Array<FindPlayerResponse | null>>;
    playerIds: string[];
    newPrice: number;
    updatePlayerPriceRequest: UpdatePlayerPriceDto
    updatePlayerPriceResponse: APIResponse<FindPlayerResponse | null>;
    newStatus = Status.SUSPENDED
    updatePlayerStatusRequest: UpdatePlayerStatusDto
    updatePlayerStatusResponse: APIResponse<FindPlayerResponse | null>;


    //team component tests
    createTeamRequest: CreateTeamRequest;
    createTeamResponse: APIResponse<CreateTeamResponseDTO>


    fromPhrase<T = APIResponse<Record<string, unknown>>>(phrase: string, suffix?: string) {
        const fullstr = suffix ? `${phrase}${suffix}` : phrase;
        const value = asVar(fullstr);
        return this[value] as T;
      }
    
}
