import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { PostStatus } from 'src/common/enums';

export class QueryPostDto extends BaseQueryDto {
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];
}
