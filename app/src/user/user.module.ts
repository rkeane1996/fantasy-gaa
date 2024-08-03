import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      process.env.USER_DB_CONNECTION_NAME,
    ),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
