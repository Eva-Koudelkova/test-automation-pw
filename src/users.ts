import * as dotenv from 'dotenv';
dotenv.config();

export const testUser = {
  fullName: process.env.TEST_USER_FULLNAME!,
  username: process.env.TEST_USER_USERNAME!,
  password: process.env.TEST_USER_PASSWORD!,
};

export const admin = {
  username: process.env.ADMIN_USERNAME!,
  password: process.env.ADMIN_PASSWORD!,
};
