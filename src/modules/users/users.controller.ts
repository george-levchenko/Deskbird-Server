import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';

@Controller('users')
// @UseGuards(AuthGuard) @ToDo enable guard
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: Partial<User>) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
