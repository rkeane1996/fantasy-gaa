import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClubDTO } from '../../../lib/common/dto/club.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../auth/constants/roles';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true, unique: true })
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
