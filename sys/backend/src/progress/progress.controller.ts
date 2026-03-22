import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import type { User } from '@prisma/client';
import { IsBoolean, IsOptional } from 'class-validator';

class MarkProgressDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getUserProgress(@Req() req: Request) {
    const user = req.user as User;
    return this.progressService.getUserProgress(user.id);
  }

  @Post(':contentId')
  markProgress(
    @Param('contentId') contentId: string,
    @Body() body: MarkProgressDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.progressService.markProgress(
      user.id,
      contentId,
      body.completed ?? false,
    );
  }

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    const user = req.user as User;
    return this.progressService.getDashboard(user.id);
  }
}
