import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên thẻ (tag) không được để trống' })
  name: string;
}
