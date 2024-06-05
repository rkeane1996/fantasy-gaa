import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  readonly password: string;
}
