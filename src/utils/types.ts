export class CreateUserParams {
  username: string;
  password: string;
}

export class LoginUserParams extends CreateUserParams {}
