import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ApiResponse } from 'src/common/classes/api-response.class';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return ApiResponse.success(data, 'User created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return ApiResponse.success(data, 'Users retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return ApiResponse.success(data, 'User retrieved successfully');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(id, updateUserDto);
    return ApiResponse.success(data, 'User updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(id);
    return ApiResponse.success(data, 'User deleted successfully');
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.usersService.login(loginDto);
    return ApiResponse.success(data, 'Login successful');
  }
}
