import { Injectable } from '@nestjs/common';
import { Folder } from './interface/folder.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FoldersService {
  private folders: Folder[] = [];

  create(name: string, parentId?: string): Folder {
    const folder: Folder = {
      id: uuidv4(),
      name,
      parentId,
    };
    this.folders.push(folder);
    return folder;
  }
}