import { Controller, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagUpdate } from './interface/tag.interface';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('update')
  updateTags(@Body() tagUpdate: TagUpdate) {
    return this.tagsService.updateTags(tagUpdate);
  }
}
