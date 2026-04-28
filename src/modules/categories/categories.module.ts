import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CategoryQueryService } from './services/category.query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryQueryService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
