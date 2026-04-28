import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { QueryCategoryDto } from '../dto/query-category.dto';

@Injectable()
export class CategoryQueryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  createQueryList(query: QueryCategoryDto) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    const skip = (query.page - 1) * query.pageSize;

    if (query.keyword) {
      queryBuilder.andWhere('category.name LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.startCreatedAt && query.endCreatedAt) {
      queryBuilder.andWhere('category.createdAt BETWEEN :start AND :end', {
        start: query.startCreatedAt,
        end: query.endCreatedAt,
      });
    }

    queryBuilder.orderBy(`category.${query.sortField}`, query.sortOrder);
    queryBuilder.skip(skip).take(query.pageSize);

    return queryBuilder;
  }
}
