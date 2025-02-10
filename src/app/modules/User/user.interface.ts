import { Identifier, UserStatus } from '@prisma/client'; // Ensure that @prisma/client is installed and Identifier is correctly exported from it

export type IUser = {
  userName: string;
  password: string;
  email: string;
  status: UserStatus;
  dateOfBirth: string;
  identifier: Identifier;
  currentLocation: string;
  firstName: string;
  lastName: string;
};

export type UpdateUserInput = {
  userName: string;
  password: string;
  dateOfBirth: string;
  currentLocation: string;
  identifier: Identifier;
};
