import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';

@Injectable()
export class UserSeedService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async run() {
    // @ToDo enable if db needs to be wiped on launch
    // await this.userRepository.clear();

    const count = await this.userRepository.count();

    if (!count) {
      const password = await bcrypt.hash('admin', 10);
      const users: CreateUserDto[] = [
        {
          username: 'admin',
          password,
          name: 'George',
          email: 'george@gmail.com',
          isAdmin: true,
        },
      ];
      await this.userRepository.save(users);
    }
  }
}
