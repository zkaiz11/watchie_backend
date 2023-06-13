import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationProvider } from 'src/auth/providers/auth.provider';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();
    return users;
  }

  async findOne(username: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async createUser(userDetials: CreateUserParams): Promise<User> {
    const hashedPassword = await AuthenticationProvider.generateHash(
      userDetials.password,
    );
    const FoundUser = await this.userRepository.findOne({
      where: {
        username: userDetials.username,
      },
    });
    if (FoundUser)
      throw new HttpException(
        'Username is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    const user: CreateUserParams = {
      username: userDetials.username,
      password: hashedPassword,
    };
    const newUser = this.userRepository.create({
      ...user,
    });
    const createdUser: User = await this.userRepository.save(newUser);
    return createdUser;
  }
}
