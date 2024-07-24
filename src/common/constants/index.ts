import * as dotenv from 'dotenv';
dotenv.config();

export const passwordPattern = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])',
);

export const CONSTANT = {
  USER_CONFLICT: 'Username or Email has been taken',
  CREDS_TAKEN: 'Credentials taken',
  INCORRECT_CREDS: 'Incorrect Credentials',
  USER_NOT_FOUND: 'User not found',
  INVALID_PASSWORD: 'Invalid Password',
  INVALID_TOKEN: 'Invalid Token',
  INVALID_REFERRAL: 'Invalid Referral Code',
  INVALID_USER: 'Invalid User',
  INVALID_EMAIL: 'Invalid Email',
  INVALID_USERNAME: 'Invalid Username',
  INVALID_PASSWORD_FORMAT:
    'Password must contain at least one uppercase, lowercase, digit and special character',
  OOPs: 'Oops! Something went wrong!',
  ERROR_CREATING_REF_CODE: 'An Error Occured while creating referral code',
  TOKEN_EXP: 'Your session has expired. Please log in again to continue.',
  SIGN_IN_FAILED: 'Sign in failed!',
  LOGIN_URL_SENT:
    'A url has been sent to your mail, Please click the link to login',
  UNAUTHORIZED: 'You are not Authorized to access this resource',
};

export const SENSITIVE_INFO = ['password'];

export const MAIL = {
  noreply: 'noreply@walletAPI.ng',
  waitListSubject: 'Welcome to Wallet API',
  waitListFrom: 'Wallet API',
  resetPassword: "Wallet API: Here's the reset password link you requested",
};
