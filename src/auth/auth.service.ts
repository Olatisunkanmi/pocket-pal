import { UsersService } from '../users/users.service';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import { PrismaClient } from '@prisma/client';
import { AppUtilities } from 'src/app.utilities';
import { CONSTANT } from 'src/common/constants';
import { changePasswordDto } from './dto/resetPassword';
import { EmailService } from 'src/common/email/email.service';
import AppLogger from 'src/common/logger/logger.config';

const { CREDS_TAKEN, INCORRECT_CREDS, SIGN_IN_FAILED } = CONSTANT;

@Injectable()
class AuthService {
  private jwtExpires: number;

  constructor(
    private readonly prisma: PrismaClient,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly logger: AppLogger,
  ) {
    this.jwtExpires = this.configService.get<number>(
      'jwt.signOptions.expiresIn',
    );
  }

  /**
   * @private {signToken}
   */
  private async signToken(
    userId: string,
  ): Promise<{ access_token: string; statusCode: number }> {
    const payload = {
      sub: userId,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '120m',
      secret: this.configService.get('JWT_SECRET'),
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLogin: new Date().toISOString(),
      },
    });

    return {
      statusCode: 200,
      access_token: token,
    };
  }

  /**
   * @private {verifyUserWithPassword}
   */
  private async verifyUserWithPassword(id: string, dto: changePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: id },
    });

    const isCorrectPassword = await AppUtilities.validatePassword(
      user.password,
      dto.password,
    );

    if (!isCorrectPassword) throw new ForbiddenException(INCORRECT_CREDS);
    else return user;
  }

  /**
   * User SignUp
   */
  async signUp(dto: UserSignUpDto) {
    try {
      const password = await AppUtilities.hashPassword(dto.password);
      const user = await this.usersService.createUser(dto, password);

      return { statusCode: 200, message: user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException(CREDS_TAKEN);
      }
      throw error;
    }
  }
  /**
   * User Login
   */
  async login(dto: UserLoginDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email: dto.email },
      });

      const isMatch = await AppUtilities.validatePassword(
        dto.password,
        user.password,
      );

      if (!isMatch) throw new UnauthorizedException(SIGN_IN_FAILED);

      return this.signToken(user.id);
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException(INCORRECT_CREDS);
      throw error;
    }
  }

  /**
   * User Change Password
   */
  async changeUserPassword(dto: changePasswordDto, id: string) {
    const user = await this.verifyUserWithPassword(id, dto);

    if (user) {
      const password = await AppUtilities.hashPassword(dto.password);
      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: password,
        },
      });
    }
  }
}

export default AuthService;
