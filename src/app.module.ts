import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkersModule } from './workers/workers.module';
import { CommitteesModule } from './committees/committees.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [PrismaModule, WorkersModule, CommitteesModule, GalleryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
