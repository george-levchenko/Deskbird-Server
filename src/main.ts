import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeedService } from './utils/seed/user-seed.service';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters/http-exception.filter';
import { LoggerService } from './utils/logger/logger.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userSeedService = app.get(UserSeedService);
  await userSeedService.run();

  const logger: LoggerService = new LoggerService('Init');
  logger.verbose(`Application listening on port => ${process.env.PORT ?? 3000}`);

  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // CSRF protection not required because cookies are not used
  // app.use(doubleCsrf(doubleCsrfOptions).doubleCsrfProtection);
  app.use(helmet()); // Set security-related HTTP headers
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
