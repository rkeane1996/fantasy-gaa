import { IUser, IUserResponseType } from "../db/mongodb/types/user.type";
import { asVar } from "../utils/data-utils/argument";
import { APIResponse } from "../utils/service-client/api-response";

export class World {
    [key: string]: unknown;
    
    
    //User Component tests
    users: IUser[];
    token: string;
    clubName: string;
    getUserResponse: APIResponse<IUserResponseType[]> | undefined;
    getUserByClubResponse: APIResponse<IUserResponseType[]> | undefined;


    fromPhrase<T = APIResponse<Record<string, unknown>>>(phrase: string, suffix?: string) {
        const fullstr = suffix ? `${phrase}${suffix}` : phrase;
        const value = asVar(fullstr);
        return this[value] as T;
      }
    
}
