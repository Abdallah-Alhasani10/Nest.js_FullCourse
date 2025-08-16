import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './enitites/file_entities';
import { CloudinaryService } from './cloudinary/cloudinary_service';
import { CloudinaryModule } from './cloudinary/cloudinary_module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports:[
    TypeOrmModule.forFeature([File]),
    CloudinaryModule,
    MulterModule.register({
      storage:memoryStorage()
    })
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
