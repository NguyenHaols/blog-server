import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Tên thẻ (tag) không được để trống' })
  @MaxLength(100, { message: 'Tên thẻ (tag) không được vượt quá 100 ký tự' })
  name: string;
}
