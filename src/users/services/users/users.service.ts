import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationProvider } from 'src/auth/providers/auth.provider';
import { MoviesService } from 'src/movies/services/movies/movies.service';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, addNewUser } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private movieService: MoviesService,
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
      relations: ['favorite_movies'],
    });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async addUser(userDetials: addNewUser): Promise<User> {
    const hashedPassword = await AuthenticationProvider.generateHash(
      userDetials.password,
    );
    const FoundUser = await this.userRepository.exist({
      where: {
        username: userDetials.username,
      },
    });
    if (FoundUser)
      throw new HttpException(
        'Username is already taken.',
        HttpStatus.BAD_REQUEST,
      );
    const user: addNewUser = {
      username: userDetials.username,
      password: hashedPassword,
      first_name: userDetials.first_name,
      last_name: userDetials.last_name,
      isAdmin: userDetials.isAdmin,
      balance: userDetials.balance,
    };
    const newUser = this.userRepository.create({
      ...user,
    });
    const createdUser: User = await this.userRepository.save(newUser);
    return createdUser;
  }

  async updateUser(userDetials: addNewUser, id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user)
      throw new HttpException('User Does Exist.', HttpStatus.BAD_REQUEST);
    if (userDetials.password) {
      const hashedPassword = await AuthenticationProvider.generateHash(
        userDetials.password,
      );
      user.password = hashedPassword;
    }
    if (userDetials.balance) user.balance = userDetials.balance;
    if (userDetials.isAdmin !== null) user.isAdmin = userDetials.isAdmin;
    if (userDetials.first_name) user.first_name = userDetials.first_name;
    if (userDetials.last_name) user.last_name = userDetials.last_name;
    return await this.userRepository.save(user);
  }

  async createUser(userDetials: CreateUserParams): Promise<User> {
    const hashedPassword = await AuthenticationProvider.generateHash(
      userDetials.password,
    );
    const FoundUser = await this.userRepository.exist({
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

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    await this.userRepository.remove(user);
    return HttpStatus.NO_CONTENT;
  }

  async getFavoriteMovie(username: string) {
    const user = await this.findOne(username);
    return user.favorite_movies;
  }

  async addFavoriteMovie(username: string, movieId: number) {
    const user = await this.findOne(username);
    const movie = await this.movieService.getMovie(movieId);
    if (user.favorite_movies.includes(movie)) {
      throw new HttpException('hell nah', HttpStatus.CONFLICT);
    }
    user.favorite_movies = [...user.favorite_movies, movie];
    this.userRepository.save(user);
    return user.favorite_movies;
  }

  async removeFavoriteMovie(username: string, movieId: number) {
    const user = await this.findOne(username);
    const movieToRemove = await this.movieService.getMovie(movieId);
    user.favorite_movies = user.favorite_movies.filter((movie) => {
      return movie.id !== movieToRemove.id;
    });
    await this.userRepository.save(user);
    return user.favorite_movies;
  }
}
