import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiBody } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export const ResetPasswordSwaggerDto = ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
    },
  },
});
export class ChangeUserPasswordDto {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  token: string;
}

export const ChangeUserPasswordSwaggerDto = ApiBody({
  schema: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
      },

      confirmPassword: {
        type: 'string',
      },
      token: {
        type: 'string',
      },
    },
  },
});
