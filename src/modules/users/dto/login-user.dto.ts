import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu của người dùng',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
