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
    if (userInfo.username.length < 4) {
      throw new HttpException(
        'Username must be at least 4 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (password.length < 8) {
      throw new HttpException(
        'Password must be at least 8 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
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
    const token = await this.authService.login(userDetails);
    return token;
  }
}
