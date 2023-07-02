import { CreateMovieDto } from 'src/movies/dtos/CreateMovie.dto';

export class CreateUserParams {
  username: string;
  password: string;
}

export class LoginUserParams extends CreateUserParams {}

export class CreateMovieParams extends CreateMovieDto {
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}

export class addNewUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  isAdmin: boolean;
  balance: number;
}
