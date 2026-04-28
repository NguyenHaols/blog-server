import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './services/posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Category } from '../categories/entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { PostQueryService } from './services/post.query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, Category]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService, PostQueryService],
  exports: [PostsService],
})
export class PostsModule {}
