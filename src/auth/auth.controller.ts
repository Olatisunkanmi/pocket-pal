import AuthService from '../auth/auth.service';
import { Public } from '../common/decorators/auth.public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { ChangeUserPasswordDto, ResetPasswordDto } from './dto/resetPassword';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginDto, UserSignUpDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User Sign up
   */
  @Public()
  @Post('register')
  register(@Body() dto: UserSignUpDto) {
    return this.authService.signUp(dto);
  }

  /**
   * user login
   */
  @Public()
  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Change user password
   */
  @Public()
  @Post('request-reset-password')
  async changeUserPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.sendResetPasswordMail(dto);
  }

  @Public()
  @Get('reset-password')
  @Render('resetPassword')
  resetPasswordPage(@Query('token') token: string): { token: string } {
    return { token };
  }

  @Public()
  @Post('reset-password')
  async handleResetPassword(
    @Body() dto: ChangeUserPasswordDto,
    @Res() res,
  ): Promise<void | string> {
    await this.authService.resetPassword(dto);

    return res
      .status(HttpStatus.OK)
      .send('Password has been reset successfully');
  }
}
