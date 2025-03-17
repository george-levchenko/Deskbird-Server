import { User } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll() {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(user: User) {
    // @ToDo enable if password should be encrypted but than it cannot be shown in UI
    // user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  }

  async update(id: number, user: Partial<User>) {
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOne({ where: { id } });
  }

  delete(id: number) {
    return this.usersRepository.delete(id);
  }
}
