import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { QueryUserDto } from '../dto/query-user.dto';

@Injectable()
export class UserQueryService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  createQueryList(query: QueryUserDto) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const skip = (query.page - 1) * query.pageSize;

    if (query.keyword) {
      queryBuilder.andWhere('user.username LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.startCreatedAt && query.endCreatedAt) {
      queryBuilder.andWhere('user.createdAt BETWEEN :start AND :end', {
        start: query.startCreatedAt,
        end: query.endCreatedAt,
      });
    }

    queryBuilder.orderBy(`user.${query.sortField}`, query.sortOrder);
    queryBuilder.skip(skip).take(query.pageSize);

    return queryBuilder;
  }
}
