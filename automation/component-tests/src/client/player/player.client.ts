import { ServiceClient } from "../base.client";
import { CreatePlayerRequest } from "./dto/create-player.dto";
import { FindPlayerResponse } from "./dto/get-player-response";
import { UpdatePlayerPriceDto } from "./dto/update-player-price.dto";
import { UpdatePlayerStatusDto } from "./dto/update-player-status.dto";

export class PlayerClient extends ServiceClient {
    private endpoint = `player`;

    async createPlayer(request: CreatePlayerRequest, token: string) {
        const endpoint = `${this.endpoint}/create`;
        return this._post<FindPlayerResponse>(endpoint, {
            data: request,
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    async updatePlayerPrice(request: UpdatePlayerPriceDto, token: string) {
        const endpoint = `${this.endpoint}/price`;
        return this._put<FindPlayerResponse| null>(endpoint, {
            data: request,
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    async updatePlayerStatus(request: UpdatePlayerStatusDto, token: string) {
        const endpoint = `${this.endpoint}/status`;
        return this._put<FindPlayerResponse| null>(endpoint, {
            data: request,
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    async getPlayer(params: Record<string, string[]>, token: string) {
        return this._get<Array<FindPlayerResponse | null>>(this.endpoint, {
            params,
            headers: {
                authorization: `Bearer ${token}`
            }
        });
    }
}