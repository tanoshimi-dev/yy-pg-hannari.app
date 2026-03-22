import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';

const contentsDir =
  process.env.CONTENTS_DIR || join(__dirname, '..', '..', '..', 'doc', 'contents');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: contentsDir,
      serveRoot: '/media',
      serveStaticOptions: {
        index: false,
        fallthrough: false,
      },
    }),
    PrismaModule,
    AuthModule,
    ContentsModule,
    QuizzesModule,
    ProgressModule,
  ],
})
export class AppModule {}
