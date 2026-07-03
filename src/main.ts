import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //dizendo que posso usar a classe de validação
  app.enableCors({ // 03/07/2026
    origin: 'http://127.0.0.1:5500',
    credentials: true
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60
      }
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
