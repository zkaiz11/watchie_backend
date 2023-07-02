import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationProvider } from 'src/auth/providers/auth.provider';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserParams, LoginUserParams } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDetials: CreateUserParams) {
    const user = await this.userService.createUser(userDetials);
    const payLoad = { id: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payLoad);
    return { access_token: token };
  }

  async login(userDetials: LoginUserParams) {
    const user = await this.userService.findOne(userDetials.username);
    if (!user)
      throw new HttpException('Incorrect username', HttpStatus.UNAUTHORIZED);
    const verifyPassword: boolean =
      await AuthenticationProvider.comparePassword(
        userDetials.password,
        user.password,
      );
    if (!verifyPassword)
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    const payLoad = { id: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payLoad);
    return { access_token: token };
  }
}
