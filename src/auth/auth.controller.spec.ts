import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import AuthService from './auth.service';

jest.mock('src/auth/app.utilities.ts', () => ({
  AppUtilities: {
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  },
}));

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockUserData: any;

  beforeEach(async () => {
    mockUserData = require('../../test/user.data.json');

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        ConfigService,
        PrismaClient,
      ],
    }).compile();

    authService = await module.resolve<AuthService>(AuthService);
    authController = await module.resolve<AuthController>(AuthController);
  });

  describe('register user', () => {
    const creds = {
      email: 'testuser',
      first_name: 'Test First',
      last_name: 'Last Name',
      password: 'user',
    };
    const expectedResult: any = mockUserData;

    it('should register user successfully', async () => {
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(expectedResult);

      const user = await authController.register(creds);

      expect(user).toEqual(expectedResult);
    });
  });

  describe('login user', () => {
    const creds = { email: 'testUser', password: 'anewusertest' };
    const expectedResult: any = mockUserData;

    it('should login user successfully', async () => {
      jest.spyOn(authService, 'login').mockResolvedValueOnce(expectedResult);

      const user = await authController.login(creds);

      expect(user).toEqual(expectedResult);
    });
  });
});
