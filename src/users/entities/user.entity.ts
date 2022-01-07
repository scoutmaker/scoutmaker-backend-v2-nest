import { AccountStatus, User, UserRole } from '@prisma/client';

export class UserEntity {
  id: string;
  role: UserRole;
  status: AccountStatus;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  password: string;
  activeRadius: number;
  // confirmationCode: string;
  // confirmationCodeExpiryDate: Date;
  // resetPasswordToken: string;
  // resetPasswordExpiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  regionId: string;
}
