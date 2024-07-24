import AuthService from '../auth/auth.service';
import { Public } from '../common/decorators/auth.public.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { resetPasswordDto } from './dto/resetPassword';
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
  @Post('reset-password')
  async changeUserPassword(@Body() dto: resetPasswordDto) {
    return this.authService.resetUserPassword(dto);
  }
}
