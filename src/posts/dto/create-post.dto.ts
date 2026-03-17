import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  content: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Thiếu ID của tác giả' })
  author_id: string;

  @IsInt()
  @IsOptional()
  category_id?: number;
}
