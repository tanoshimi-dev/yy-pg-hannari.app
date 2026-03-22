import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

class SubmitAnswerDto {
  @IsNotEmpty({ message: '選択肢IDは必須です' })
  @IsString()
  choiceId: string;
}

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('content/:contentId')
  findByContentId(@Param('contentId') contentId: string) {
    return this.quizzesService.findByContentId(contentId);
  }

  @Post(':id/answer')
  @UseGuards(JwtAuthGuard)
  submitAnswer(
    @Param('id') id: string,
    @Body() body: SubmitAnswerDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.quizzesService.submitAnswer(id, user.id, body.choiceId);
  }
}
