import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedModule } from './utils/seed/user-seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './utils/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User],
        synchronize: true,
      }),
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
