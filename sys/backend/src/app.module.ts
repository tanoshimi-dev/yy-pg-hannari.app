import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    // Per-IP rate limit: 300 requests / minute
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    MediaModule,
    PrismaModule,
    AuthModule,
    ContentsModule,
    QuizzesModule,
    ProgressModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
