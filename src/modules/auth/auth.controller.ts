import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LocalAuthGuard } from '../../utils/guards/local/local.guard';
import { Public } from '../../utils/decorators/public.decorator';
import { User } from '../../utils/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserDto) {
    return this.authService.login(user);
  }
}
