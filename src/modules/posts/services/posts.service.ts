import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Category } from '../../categories/entities/category.entity';
import { PostQueryService } from './post.query.service';
import { QueryPostDto } from '../dto/query-post.dto';
import { PaginationResponse } from 'src/common/classes/api-response-pagination.class';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private postQueryService: PostQueryService,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const { tagIds, ...postData } = createPostDto;

    const slug = await this.generateUniqueSlug(postData.title);

    const post = this.postRepository.create({
      ...postData,
      slug,
      authorId,
    });

    if (tagIds && tagIds.length > 0) {
      post.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    return this.postRepository.save(post);
  }

  async findAll(query: QueryPostDto) {
    const { page, pageSize } = query;
    const queryList = this.postQueryService.createQueryList(query);
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
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'tags'],
    });
    if (!post) throw new NotFoundException(`Post with slug ${slug} not found`);
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    const { tagIds, ...postData } = updatePostDto;

    if (postData.title && postData.title !== post.title) {
      post.slug = await this.generateUniqueSlug(postData.title, id);
    }

    Object.assign(post, postData);

    if (tagIds) {
      post.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    return this.postRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return this.postRepository.remove(post);
  }

  private async generateUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.isSlugTaken(slug, excludeId)) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  private async isSlugTaken(slug: string, excludeId?: string) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .where('post.slug = :slug', { slug });

    if (excludeId) {
      query.andWhere('post.id != :id', { id: excludeId });
    }

    const existing = await query.getOne();
    return !!existing;
  }

  private slugify(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^a-z0-9\s-]|_)+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
