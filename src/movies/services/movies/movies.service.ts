import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/typeorm/entities/Movie';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}

  async getMovies(): Promise<Movie[]> {
    const movies = this.movieRepository.find();
    return movies;
  }

  async getMovie(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!movie)
      throw new HttpException('Movie not found', HttpStatus.BAD_REQUEST);
    return movie;
  }
  async getRandomMovie(): Promise<Movie> {
    const moviesCount = await this.movieRepository.count();
    const randomIndex = Math.floor(Math.random() * moviesCount);
    const randomMovie = await this.movieRepository.find({
      take: 1,
      skip: randomIndex,
    });
    return randomMovie[0];
  }

  // async createMovie(movieDetial: Create)
}
