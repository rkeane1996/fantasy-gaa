import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
  @Prop()
  id: string;

  @Prop({ default: Date.now })
  dateCreated: Date;
}
