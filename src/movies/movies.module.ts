import { Module } from '@nestjs/common';
import { MoviesController } from './controllers/movies/movies.controller';
import { MoviesService } from './services/movies/movies.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
