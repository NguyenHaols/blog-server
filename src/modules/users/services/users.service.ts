import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from '../../posts/dto/user-response.dto';
import { StorageService } from '../../storage/services/storage.service';
import { ConfigService } from '@nestjs/config';
import { PaginationResponse } from 'src/common/classes/api-response-pagination.class';
import { QueryUserDto } from '../dto/query-user.dto';
import { UserQueryService } from './user.query.service';

@Injectable()
export class UsersService {
  private readonly rs2PublicUrl: string;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private storageService: StorageService,
    private configService: ConfigService,
    private userQueryService: UserQueryService,
  ) {
    this.rs2PublicUrl = this.configService.get<string>('R2_PUBLIC_URL')!;
  }

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
      passwordHash: password_hash,
    });

    return await this.userRepository.save(user);
  }

  async findAll(
    query: QueryUserDto,
  ): Promise<PaginationResponse<UserResponseDto>> {
    const { page, pageSize } = query;
    const queryList = this.userQueryService.createQueryList(query);
    const [items, totalItems] = await queryList.getManyAndCount();

    return new PaginationResponse({
      items,
      metadata: {
        page,
        pageSize,
        totalItems,
      },
    });
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
      user.passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    if (user.avatarUrl) {
      const isChanged =
        updateUserDto.avatarUrl !== undefined &&
        updateUserDto.avatarUrl !== user.avatarUrl;
      const isRemoved = updateUserDto.avatarUrl === null;

      if (isChanged || isRemoved) {
        const key = user.avatarUrl.replace(this.rs2PublicUrl + '/', '');
        await this.storageService.deleteFile(key);
      }
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
    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) throw new NotFoundException('Sai mật khẩu');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
