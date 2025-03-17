import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async run() {
    // @ToDo enable if db needs to be wiped on launch
    // await this.userRepository.clear();

    const count = await this.userRepository.count();

    if (!count) {
      const users = [{ username: 'admin', password: 'admin', isAdmin: true }];
      await this.userRepository.save(users);
    }
  }
}
