import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { Folder } from './interface/folder.interface';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Body('name') name: string, @Body('parentId') parentId?: string): Folder {
    return this.foldersService.create(name, parentId);
  }

  @Put(':id')
  edit(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('parentId') parentId?: string
  ): Folder {
    return this.foldersService.edit(id, name, parentId);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { name: string, status: string } {
    const result = this.foldersService.delete(id);
    return { 
      name: result.name,
      status: 'deleted'
    };
  }

  @Get()
  getAll() {
    return this.foldersService.getAll();
  }
}