import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(user: User) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  }

  update(id: number, user: Partial<User>) {
    return this.usersRepository.update(id, user);
  }

  delete(id: number) {
    return this.usersRepository.delete(id);
  }
}
