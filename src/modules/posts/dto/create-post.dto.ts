import {
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
  thumbnailUrl?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Thiếu ID của tác giả' })
  authorId: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
