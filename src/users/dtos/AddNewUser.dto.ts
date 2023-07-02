import { IsNotEmpty } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  first_name: string;

  last_name: string;

  isAdmin: boolean;

  balance: number;
}
