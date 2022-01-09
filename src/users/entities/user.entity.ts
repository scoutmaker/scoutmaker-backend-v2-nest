import { AccountStatus, User, UserRole } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  role: UserRole;
  status: AccountStatus;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  city: string | null;
  password: string;
  activeRadius: number;
  confirmationCode: string | null;
  confirmationCodeExpiryDate: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  regionId: string;
}
