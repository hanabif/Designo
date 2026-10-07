import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const frontendOrigin = configService.get<string>('frontendUrl')?.replace(/\/+$/, '');
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  const port = configService.get<number>('port') ?? 3001;
  await app.listen(port);
}

await bootstrap();
