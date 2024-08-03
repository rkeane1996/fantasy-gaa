import { ClubDTO } from 'lib/common/dto/club.dto';
import { Role } from 'src/auth/constants/roles';

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  club: ClubDTO;
  role: Role;
}
