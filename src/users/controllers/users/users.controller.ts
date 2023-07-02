import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/typeorm/entities/User';
import { AddUserDto } from 'src/users/dtos/AddNewUser.dto';
import {
  AddFavoriteMovieDto,
  CreateUserDto,
} from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userDetials } = createUserDto;
    const user = await this.userService.createUser(userDetials);
    return user;
  }

  @Post('/addnewuser')
  @UseInterceptors(ClassSerializerInterceptor)
  async addNewUser(@Body() addNewUser: AddUserDto): Promise<User> {
    if (addNewUser.username.length < 4) {
      throw new HttpException(
        'Username must be at least 4 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (addNewUser.password.length < 8) {
      throw new HttpException(
        'Password must be at least 8 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (addNewUser.password != addNewUser.confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    const { confirmPassword, ...userDetials } = addNewUser;
    return await this.userService.addUser(userDetials);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() editUserDto: AddUserDto,
  ): Promise<User> {
    if (editUserDto.password) {
      if (editUserDto.username.length < 4) {
        throw new HttpException(
          'Username must be at least 4 characters',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (editUserDto.password.length < 8) {
        throw new HttpException(
          'Password must be at least 8 characters',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (editUserDto.password != editUserDto.confirmPassword)
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
    }
    const { confirmPassword, ...userDetials } = editUserDto;
    return this.userService.updateUser(userDetials, id);
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('/currentuser')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCurrentUser(@Req() req: Request) {
    const username = req['user'].username;
    const user = await this.userService.findOne(username);
    return user;
  }

  @Get('/favoritemovies')
  async getFavoriteMovie(@Req() req: Request) {
    const movies = this.userService.getFavoriteMovie(req['user'].username);
    return movies;
  }

  @Post('/favoritemovies')
  async addFavoriteMovie(
    @Req() req: Request,
    @Body() favoriteMovieId: AddFavoriteMovieDto,
  ) {
    const username = req['user'].username;
    const favorite_movies = this.userService.addFavoriteMovie(
      username,
      favoriteMovieId.id,
    );
    return favorite_movies;
  }

  @Delete('/favoritemovies')
  async removeFavoriteMovie(
    @Req() req: Request,
    @Body() favoriteMovieId: AddFavoriteMovieDto,
  ) {
    const username = req['user'].username;
    const favorite_movies = this.userService.removeFavoriteMovie(
      username,
      favoriteMovieId.id,
    );
    return favorite_movies;
  }
}
