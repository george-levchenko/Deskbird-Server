import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedModule } from './utils/seed/user-seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'deskbird',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    LoggerModule,
    UserSeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
