import { UsersService } from '../users/users.service';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import { PrismaClient, User } from '@prisma/client';
import { AppUtilities } from 'src/app.utilities';
import { CONSTANT } from 'src/common/constants';
import { ChangeUserPasswordDto, ResetPasswordDto } from './dto/resetPassword';
import { EmailService } from 'src/common/email/email.service';
import AppLogger from 'src/common/logger/logger.config';
import { WalletsService } from 'src/wallets/wallets.service';

const { CREDS_TAKEN, INCORRECT_CREDS, LOGIN_URL_SENT, PASSWORD_MISMATCH } =
  CONSTANT;

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
    private readonly walletService: WalletsService,
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
   * User SignUp
   */
  async signUp(dto: UserSignUpDto) {
    try {
      const password = await AppUtilities.hashPassword(dto.password);
      const user = await this.usersService.createUser(dto, password);

      await this.walletService.createWallet(user.id);

      return { statusCode: 200, message: user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new UnauthorizedException(CREDS_TAKEN);
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

      if (!isMatch) throw new UnauthorizedException(INCORRECT_CREDS);

      return this.signToken(user.id);
    } catch (error) {
      if (error.code == 'P2025') throw new ForbiddenException(INCORRECT_CREDS);
      this.logger.error(`Error Occured during User Login ${error}`);
      throw error;
    }
  }

  async sendResetPasswordMail(dto: ResetPasswordDto) {
    const isExistingUser = (await this.usersService.findUserByEmail(
      dto.email,
    )) as User;

    if (!isExistingUser) {
      this.logger.warn(
        `THREAT: NON-EXISTING USER TRIED TO RESET PASSWORD, CREDS: ${dto.email}`,
      );

      return LOGIN_URL_SENT;
    }

    const token = AppUtilities.generateToken();
    const hashedToken = AppUtilities.hashToken(token);

    const resetToken = await this.prisma.token.create({
      data: {
        token: hashedToken,
        userId: isExistingUser.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    const opts = {
      email: isExistingUser.email,
      username: isExistingUser.last_name,
      resetToken: resetToken.token,
    };

    await await this.emailService.sendPasswordResetMail(opts);
    return LOGIN_URL_SENT;
  }

  async resetPassword(dto: ChangeUserPasswordDto) {
    const { password, confirmPassword, token } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException(PASSWORD_MISMATCH);
    }

    const resetToken = await this.prisma.token.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid token');
    }

    const hashedPassword = await AppUtilities.hashPassword(password);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.token.delete({
      where: { token },
    });
  }
}

export default AuthService;
