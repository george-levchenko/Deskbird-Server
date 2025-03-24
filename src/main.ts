import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeedService } from './utils/seed/user-seed.service';
import { LoggerService } from './utils/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './utils/intercepter/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userSeedService = app.get(UserSeedService);
  await userSeedService.run();

  const logger: LoggerService = new LoggerService();
  logger.verbose(`Application listening on port => ${process.env.PORT ?? 3000}`);

  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
