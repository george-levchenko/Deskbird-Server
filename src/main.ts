import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeedService } from './utils/seed/user-seed.service';
import { LoggerService } from './utils/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: LoggerService = new LoggerService();

  const userSeedService = app.get(UserSeedService);
  await userSeedService.run();

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  logger.verbose(`Application listening on port => ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
