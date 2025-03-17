import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeedService } from './utils/seed/user-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userSeedService = app.get(UserSeedService);
  await userSeedService.run();
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
