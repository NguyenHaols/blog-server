import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from '../../common/classes/api-response.class';
import { QueryCategoryDto } from './dto/query-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return ApiResponse.success(data, 'Category created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryCategoryDto) {
    const data = await this.categoriesService.findAll(query);
    return ApiResponse.success(data, 'Categories retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    return ApiResponse.success(data, 'Category retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return ApiResponse.success(data, 'Category updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.categoriesService.remove(id);
    return ApiResponse.success(data, 'Category deleted successfully');
  }
}
