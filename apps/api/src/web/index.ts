import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from 'typeorm';
import { Session } from '@taverna/typeorm';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
    cors: {
      origin: 'http://localhost:4000',
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(
    session({
      secret: process.env.WEB_SESSION_SECRET || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        ttl: 86400,
      }).connect(getRepository(Session)),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.API_PORT || 3000, '0.0.0.0');
}
