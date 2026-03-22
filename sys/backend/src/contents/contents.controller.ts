import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from './contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.contentsService.findAll(categoryId);
  }

  @Get('categories')
  getCategories() {
    return this.contentsService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }
}
