import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/Post_entities';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/User_auth_dto';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { FileUploadModule } from './file-upload/file-upload.module';
import {ConfigModule} from '@nestjs/config'
import { File } from './file-upload/enitites/file_entities';

@Module({
  
  imports: [
      ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // 60 ثانية = دقيقة
          limit: 5, // 5 محاولات
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CacheModule.register({
      isGlobal:true,
      ttl:30000,
      max:100
    }),
    TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'ADMIN',
    database:'nestjscourse',
    entities:[Post,User,File],
    synchronize:true
  }),
  PostModule, AuthModule, FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
