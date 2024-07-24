import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import AuthService from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockUserData;

  beforeEach(async () => {
    mockUserData = require('test/user.data.json');

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        ConfigService,
        PrismaClient,
      ],
    }).compile();

    authService = await module.resolve(AuthService);
    authController = await module.resolve(AuthController);
  });

  describe('register user', () => {
    const creds = { email: 'testuser' };
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

    it('logins', async () => {
      jest.spyOn(authService, 'login').mockResolvedValueOnce(expectedResult);

      const user = await authController.login(creds);

      expect(user).toEqual(expectedResult);
    });
  });
});
