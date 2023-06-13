import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationProvider } from 'src/auth/providers/auth.provider';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserParams, LoginUserParams } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  signUp(userDetials: CreateUserParams): Promise<User> {
    return this.userService.createUser(userDetials);
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
