import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { TagsModule } from './modules/tags/tags.module';
import { User } from './modules/users/entities/user.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Tag } from './modules/tags/entities/tag.entity';
import { Post } from './modules/posts/entities/post.entity';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Category, Tag, Post],
        synchronize: false,
        timezone: '+07:00',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    PostsModule,
    UsersModule,
    TagsModule,
    StorageModule,
  ],
  controllers: [AppController],
  // providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard('jwt') }],
  providers: [AppService],
})
export class AppModule {}
