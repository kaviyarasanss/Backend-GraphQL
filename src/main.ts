import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map(err => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        return new BadRequestException(messages);
      },
    }),
  );

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
  Logger.log(`Graphql server running on http://localhost:${port}/graphql`);
}

bootstrap();
