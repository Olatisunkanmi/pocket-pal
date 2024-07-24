import AuthService from '../auth/auth.service';
import { Public } from '../common/decorators/auth.public.decorator';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import { changePasswordDto } from './dto/resetPassword';

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
  login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Change user password
   */
  @Public()
  @Post('reset-password/:id')
  changeUserPassword(@Body() dto: changePasswordDto, @Param('id') id: string) {
    return this.authService.changeUserPassword(dto, id);
  }
}
