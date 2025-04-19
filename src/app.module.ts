import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { FoldersModule } from './folders/folders.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DocumentsModule, FoldersModule, TagsModule, AuthModule],
})
export class AppModule {}
