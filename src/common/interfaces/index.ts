import { Request } from 'express';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export enum AccountType {
  INDIVIDUAL = 'individual',
  FLEET_DRIVER = 'fleet_driver',
  BOTH = 'both',
}

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
  FAILED = 'Request Failed!',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface RequestUser extends Request {
  user: JwtPayload;
}

export interface JwtPayload {
  sub: string;
  userId: string;
  iat: number;
  exp: number;
}

export enum AuthStrategyType {
  JWT = 'jwt',
  HTTP_BEARER = 'http-bearer',
  PUBLIC = 'public',
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface SessionOptions {
  sessionType?: string;
  userId?: string;
}
