import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from 'src/constants/authConstant';
import { MoviesService } from 'src/movies/services/movies/movies.service';
import { Movie } from 'src/typeorm/entities/Movie';

@Controller('movies')
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  // @Post('/')
  // async postMovie(@Body() movies) {
  //   return 0;
  // }

  @Public()
  @Get('/')
  async getMovies(): Promise<Movie[]> {
    const movies = await this.movieService.getMovies();
    return movies;
  }

  @Public()
  @Get('/random')
  async getRandomMovie(): Promise<Movie> {
    const movie = await this.movieService.getRandomMovie();
    return movie;
  }

  @Public()
  @Get('/:id')
  async getMovie(@Param('id', ParseIntPipe) id: number) {
    const movie = await this.movieService.getMovie(id);
    return movie;
  }
}
