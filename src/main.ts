import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT);

  logger.log(`Server is running on port ${PORT}`);
}
bootstrap();
