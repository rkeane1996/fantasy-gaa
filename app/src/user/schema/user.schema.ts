import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClubDTO } from 'lib/common/dto/club.dto';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/constants/roles';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
    default: () => uuidv4(7),
    index: { unique: true },
  })
  userId: string;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, type: String })
  password: string;
  @Prop({ required: true })
  dateOfBirth: Date;
  @Prop({ required: true })
  club: ClubDTO;
  @Prop({ required: false, default: Role.User })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>(['save'], async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
