import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { Repository } from 'typeorm';
import { QueryTagDto } from '../dto/query-tag.dto';

@Injectable()
export class TagsQueryService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  createQueryList(query: QueryTagDto) {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    const skip = (query.page - 1) * query.pageSize;

    if (query.keyword) {
      queryBuilder.andWhere('tag.name LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.startCreatedAt && query.endCreatedAt) {
      queryBuilder.andWhere('tag.createdAt BETWEEN :start AND :end', {
        start: query.startCreatedAt,
        end: query.endCreatedAt,
      });
    }

    queryBuilder.orderBy(`tag.${query.sortField}`, query.sortOrder);
    queryBuilder.skip(skip).take(query.pageSize);

    return queryBuilder;
  }
}
