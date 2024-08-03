import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ClubDTO } from '../../../lib/common/dto/club.dto';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'hello@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 2 })
  @ApiProperty({
    example: 'DTG234vnfdr',
  })
  password: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1990-01-01',
  })
  dateOfBirth: Date;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Galway',
  })
  club: ClubDTO;
}
