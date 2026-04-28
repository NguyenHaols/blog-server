import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './services/tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity';
import { TagsQueryService } from './services/tags.query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagsQueryService],
  exports: [TagsService],
})
export class TagsModule {}
