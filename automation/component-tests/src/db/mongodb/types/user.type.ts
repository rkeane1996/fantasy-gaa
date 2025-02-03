import mongoose, { ObjectId, Schema } from "mongoose";
import { IClub } from "./club.type";

export interface IUser {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        dateOfBirth: Date;
        club: IClub;
        role: IRole;
        _id?: mongoose.Types.ObjectId | number;
}

export interface IUserResponseType {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        dateOfBirth: Date;
        club: IClub;
        role: IRole;
        userId: string;
}

export enum IRole {
    User = 'user',
    Admin = 'admin',
    Fake = 'fake'
  }
  