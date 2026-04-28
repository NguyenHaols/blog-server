import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';
import { QueryTagDto } from '../dto/query-tag.dto';
import { TagsQueryService } from './tags.query.service';
import { PaginationResponse } from 'src/common/classes/api-response-pagination.class';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private tagQueryService: TagsQueryService,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const name = createTagDto.name.trim();
    await this.ensureNameAvailable(name);

    const slug = await this.generateUniqueSlug(name);
    const tag = this.tagRepository.create({ name, slug });
    return this.tagRepository.save(tag);
  }

  async findAll(query: QueryTagDto) {
    const { page, pageSize } = query;
    const queryList = this.tagQueryService.createQueryList(query);
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
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);

    if (updateTagDto.name !== undefined) {
      const name = updateTagDto.name.trim();
      if (!name) {
        throw new BadRequestException('Tên thẻ (tag) không được để trống');
      }

      if (name !== tag.name) {
        await this.ensureNameAvailable(name, id);
        tag.name = name;
        tag.slug = await this.generateUniqueSlug(name, id);
      }
    }

    return this.tagRepository.save(tag);
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    return this.tagRepository.remove(tag);
  }

  private async ensureNameAvailable(name: string, excludeId?: string) {
    const existingTag = await this.tagRepository.findOne({
      where: excludeId ? { name, id: Not(excludeId) } : { name },
    });

    if (existingTag) {
      throw new BadRequestException('Tên tag đã tồn tại');
    }
  }

  private async generateUniqueSlug(name: string, excludeId?: string) {
    const baseSlug = this.slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.isSlugTaken(slug, excludeId)) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  private async isSlugTaken(slug: string, excludeId?: string) {
    const existingTag = await this.tagRepository.findOne({
      where: excludeId ? { slug, id: Not(excludeId) } : { slug },
    });

    return Boolean(existingTag);
  }

  private slugify(value: string) {
    const slug = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');

    return slug || 'tag';
  }
}
