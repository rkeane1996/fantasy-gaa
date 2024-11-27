import { HydratedDocument, model, Schema } from 'mongoose';
import { IRole, IUser } from '../types/user.type';

const GAAClubSchema = new Schema({
    clubName: String,
    county: String,
});

const userSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        dateOfBirth: Date,
        club: GAAClubSchema,
        role: {
            type: String,
            enum: IRole,
        },
    }
)


export type UserDocument = HydratedDocument<IUser>

export const UserModel = model<UserDocument>('User', userSchema)


