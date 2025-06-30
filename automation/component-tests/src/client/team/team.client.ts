import { ServiceClient } from "../base.client";
import { CreateTeamResponseDTO } from "./dto/create-team-response.dto";
import { CreateTeamRequest } from "./dto/create-team.dto";
import { EditTeamInfoRequest } from "./dto/edit-team-dto";
import { GetTeamResponse } from "./dto/get-team-dto";
import { TeamTransferRequest } from "./dto/team-transfer.dto";

export class TeamClient extends ServiceClient{
    private endpoint = `team`;

    async createTeam(request: CreateTeamRequest, token: string){
        const endpoint = `${this.endpoint}/create`;
        return this._post<CreateTeamResponseDTO>(endpoint,{
            data: request,
            headers:{
                authorization: `Bearer ${token}`
            }
        })     
    }

    async getTeam(params: Record<string, string>, token: string){
        return this._get<GetTeamResponse>(this.endpoint, {
            params,
            headers:{
                authorization: `Bearer ${token}`
            }
        });  
    }

  async makeTransfer(request: TeamTransferRequest, token: string) {
    const endpoint = `${this.endpoint}/makePlayerTransfer`;
    return this._put<GetTeamResponse>(endpoint, {
        data: request,
        headers:{
            authorization: `Bearer ${token}`
        }
    }); 
  }

  
  async getUsersTeam(params: Record<string, string>, token: string){
    const endpoint = `${this.endpoint}/users`;
    return this._get<GetTeamResponse>(this.endpoint, {
        params,
        headers:{
            authorization: `Bearer ${token}`
        }
    }); 
  }


  async updateTeam(request: EditTeamInfoRequest, token: string){
    const endpoint = `${this.endpoint}/update`;
    return this._put<GetTeamResponse>(this.endpoint, {
        data: request,
        headers:{
            authorization: `Bearer ${token}`
        }
    }); 
  }
    
}