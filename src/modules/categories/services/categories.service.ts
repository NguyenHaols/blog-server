import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryQueryService } from './category.query.service';
import { PaginationResponse } from 'src/common/classes/api-response-pagination.class';
import { QueryCategoryDto } from '../dto/query-category.dto';

function createSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryQueryService: CategoryQueryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    category.slug = createSlug(category.name);
    return this.categoryRepository.save(category);
  }

  async findAll(query: QueryCategoryDto) {
    const { page, pageSize } = query;
    const queryList = this.categoryQueryService.createQueryList(query);
    const [items, totalItems] = await queryList.getManyAndCount();
    return new PaginationResponse({
      items,
      metadata: {
        page,
        pageSize,
        totalItems,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);

    if (updateCategoryDto.name) {
      category.slug = createSlug(updateCategoryDto.name);
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}
