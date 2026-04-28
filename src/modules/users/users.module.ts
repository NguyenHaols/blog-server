import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { StorageModule } from '../storage/storage.module';
import { UserQueryService } from './services/user.query.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secretKey', // In production, use environment variable
      signOptions: { expiresIn: '1d' },
    }),
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserQueryService],
  exports: [UsersService, UserQueryService],
})
export class UsersModule {}
