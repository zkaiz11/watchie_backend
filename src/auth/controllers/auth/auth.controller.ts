import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto } from 'src/auth/dtos/LoginUser.dto';
import { RegisterUserDto } from 'src/auth/dtos/RegisterUser.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Public } from 'src/constants/authConstant';
import { CreateUserParams } from 'src/utils/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() userInfo: RegisterUserDto) {
    const { password, confirmPassword } = userInfo;
    if (password != confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    const user: CreateUserParams = {
      username: userInfo.username,
      password: userInfo.password,
    };
    const newUser = await this.authService.signUp(user);
    return newUser;
  }

  @Public()
  @Post('login')
  async loginUser(@Body() userDetails: LoginUserDto) {
    const isLogin = await this.authService.login(userDetails);
    return isLogin;
  }
}
