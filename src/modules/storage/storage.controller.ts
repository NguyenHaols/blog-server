import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageFolder } from './enums/storage-folder.enum';
import { ApiResponse } from '../../common/classes/api-response.class';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  async getUploadUrl(
    @Body('folder') folder: string,
    @Body('contentType') contentType: string,
    @Body('fileExtension') fileExtension: string,
  ) {
    if (!folder) {
      throw new BadRequestException('Folder parameter is required');
    }

    if (!Object.values(StorageFolder).includes(folder as StorageFolder)) {
      throw new BadRequestException(
        `Invalid folder. Allowed values are: ${Object.values(StorageFolder).join(', ')}`,
      );
    }

    if (!contentType) {
      throw new BadRequestException('contentType parameter is required');
    }

    if (!fileExtension) {
      throw new BadRequestException('fileExtension parameter is required');
    }

    const result = await this.storageService.createPresignedUrl(
      folder as StorageFolder,
      contentType,
      fileExtension,
    );

    return ApiResponse.success(result, 'Presigned URL generated successfully');
  }

  @Get('view')
  async getLinkView(@Query('key') key: string) {
    const link = await this.storageService.getLinkView(key);
    return ApiResponse.success(link, 'Link retrieved successfully');
  }
}
