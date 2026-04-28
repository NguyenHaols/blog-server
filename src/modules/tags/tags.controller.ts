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
import { TagsService } from './services/tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiResponse } from '../../common/classes/api-response.class';
import { QueryTagDto } from './dto/query-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    const data = await this.tagsService.create(createTagDto);
    return ApiResponse.success(data, 'Tag created successfully');
  }

  @Get()
  async findAll(@Query() query: QueryTagDto) {
    const data = await this.tagsService.findAll(query);
    return ApiResponse.success(data, 'Tags retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.tagsService.findOne(id);
    return ApiResponse.success(data, 'Tag retrieved successfully');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const data = await this.tagsService.update(id, updateTagDto);
    return ApiResponse.success(data, 'Tag updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.tagsService.remove(id);
    return ApiResponse.success(data, 'Tag deleted successfully');
  }
}
