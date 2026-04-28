import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { QueryPostDto } from '../dto/query-post.dto';

@Injectable()
export class PostQueryService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  createQueryList(query: QueryPostDto) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags');

    const skip = (query.page - 1) * query.pageSize;

    if (query.keyword) {
      queryBuilder.andWhere(
        '(post.title LIKE :keyword OR post.summary LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: `%${query.keyword}%` },
      );
    }

    if (query.status) {
      queryBuilder.andWhere('post.status = :status', { status: query.status });
    }

    if (query.categoryId) {
      queryBuilder.andWhere('post.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', {
        authorId: query.authorId,
      });
    }

    if (query.startCreatedAt && query.endCreatedAt) {
      queryBuilder.andWhere('post.createdAt BETWEEN :start AND :end', {
        start: query.startCreatedAt,
        end: query.endCreatedAt,
      });
    }

    queryBuilder.orderBy(`post.${query.sortField}`, query.sortOrder);
    queryBuilder.skip(skip).take(query.pageSize);

    return queryBuilder;
  }
}
