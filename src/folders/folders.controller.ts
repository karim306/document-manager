import { Controller, Post, Body } from '@nestjs/common';
import { FoldersService } from './folders.service';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post('create')
  create(@Body('name') name: string, @Body('parentId') parentId?: string) {
    return this.foldersService.create(name, parentId);
  }
}