import { Module } from '@nestjs/common';
import { CommitteesController } from './committees.controller';

@Module({
  controllers: [CommitteesController],
})
export class CommitteesModule {}
