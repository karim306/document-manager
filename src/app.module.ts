import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { FoldersModule } from './folders/folders.module';
import { SharedModule } from './shared/shared.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SharedModule,
    DocumentsModule,
    FoldersModule,
    TagsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
