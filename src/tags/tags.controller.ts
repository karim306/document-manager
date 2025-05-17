import { Controller, Post, Body, Put, Get, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagUpdate } from './interface/tag.interface';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('search/documents')
  searchDocuments(
    @Query('tags') tags: string,
    @Query('folderId') folderId?: string
  ) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.tagsService.searchByTags(tagArray, folderId);
  }

  @Get('list/all')
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Post()
  addTags(@Body() tagUpdate: TagUpdate) {
    return this.tagsService.addTags(tagUpdate);
  }

  @Put('document/:documentId')
  updateTags(
    @Param('documentId') documentId: string,
    @Body('tags') tags: string[]
  ) {
    return this.tagsService.updateTags({ documentId, tags });
  }

  @Get('document/:documentId')
  getTags(@Param('documentId') documentId: string) {
    return this.tagsService.getTags(documentId);
  }
}
