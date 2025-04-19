import { Injectable } from '@nestjs/common';
import { TagUpdate } from './interface/tag.interface';

@Injectable()
export class TagsService {
  private documentTags: Record<string, string[]> = {};

  updateTags(data: TagUpdate): any {
    this.documentTags[data.documentId] = data.tags;
    return { documentId: data.documentId, tags: data.tags };
  }
}
