import { User } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async create(user: CreateUserDto) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  }

  async update(id: number, user: UpdateUserDto) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      delete user.password;
    }
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOne({ where: { id } });
  }

  delete(id: number) {
    return this.usersRepository.delete(id);
  }
}
