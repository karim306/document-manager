import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BaseStorageService {
  protected loadJsonFile<T>(filePath: string): T[] {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error);
      return [];
    }
  }

  protected saveJsonFile<T>(filePath: string, data: T[]): void {
    try {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving to file ${filePath}:`, error);
      throw new Error('Failed to save changes');
    }
  }
} 