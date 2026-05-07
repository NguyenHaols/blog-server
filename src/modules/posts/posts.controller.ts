import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryPostDto } from './dto/query-post.dto';
import { ApiResponse } from 'src/common/classes/api-response.class';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() authorId: string,
  ) {
    const data = await this.postsService.create(createPostDto, authorId);
    return ApiResponse.success(data, 'Bài viết đã được tạo thành công');
  }

  @Get()
  async findAll(@Query() query: QueryPostDto) {
    const data = await this.postsService.findAll(query);
    return ApiResponse.success(data, 'Lấy danh sách bài viết thành công');
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.postsService.findBySlug(slug);
    return ApiResponse.success(
      data,
      'Lấy chi tiết bài viết theo slug thành công',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.postsService.findOne(id);
    return ApiResponse.success(data, 'Lấy chi tiết bài viết thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = await this.postsService.update(id, updatePostDto);
    return ApiResponse.success(data, 'Cập nhật bài viết thành công');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.postsService.remove(id);
    return ApiResponse.success(data, 'Xóa bài viết thành công');
  }
}
