import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Number of reverse proxy hops (e.g. Traefik) in front of the app.
  // Needed so rate limiting sees the real client IP instead of the proxy's.
  if (process.env.TRUST_PROXY_HOPS) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
  }

  app.use(
    helmet({
      // Media (images/videos) is loaded by the frontend on a different port in dev
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Hannari backend is running on http://localhost:${port}`);
}
bootstrap();
