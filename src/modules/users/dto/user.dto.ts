import { CreateUserDto } from './create-user.dto';

export class UserDto extends CreateUserDto {
  readonly id: number;
}
