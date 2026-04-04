import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { StorageFolder } from '../enums/storage-folder.enum';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'R2_SECRET_ACCESS_KEY',
        )!,
      },
      forcePathStyle: true,
    });
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME')!;
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL')!;
  }

  async getLinkView(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  }

  async createPresignedUrl(
    folder: StorageFolder,
    contentType: string,
    fileExtension: string,
  ) {
    const fileId = `${folder}/${uuidv4()}.${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileId,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 15,
    });

    const publicUrl = `${this.publicUrl}/${fileId}`;

    if (!presignedUrl) {
      throw new Error('Failed to create presigned URL');
    }

    return {
      fileId,
      presignedUrl,
      publicUrl,
    };
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
