import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

@Module({
  controllers: [DocumentsController, VersionController],
  providers: [VersionService]
})
export class DocumentsModule {}