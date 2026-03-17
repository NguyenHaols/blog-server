import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/posts/dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) throw new BadRequestException('Email đã tồn tại');

    const saltRounds = 10;
    const { password, ...rest } = createUserDto;
    const password_hash: string = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      ...rest,
      password_hash,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      created_at: savedUser.created_at,
    };
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng này');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const saltRounds = 10;
      user.password_hash = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    Object.assign(user, { ...updateUserDto });
    if ((user as any).password) {
      delete (user as any).password;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng này');
    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isMatch) throw new NotFoundException('Sai mật khẩu');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
