import { BadRequestException, Body, Controller, Delete, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from 'src/auth/Guards/auth_guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';
import { currentuser } from 'src/auth/Decorator/currentuser_decorators';
import { User, USERROLE } from 'src/auth/entities/User_auth_dto';
import { Roles } from 'src/auth/Decorator/role_decorator';
import { RolesGuard } from 'src/auth/Guards/RoleGuard';

@Controller('file-upload')
export class FileUploadController {


    constructor(private readonly fileservice:FileUploadService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(@Body() UploadFile:FileDto,@UploadedFile()file:Express.Multer.File,@currentuser()user:User)
    {
        if(!file){
            throw new BadRequestException("file is Reuired")
        }
        return this.fileservice.uploadfile(file,UploadFile.description,user);
    }

    @Delete(':id')
    @Roles(USERROLE.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    async delete(@Param('id',ParseUUIDPipe)id:string){
        await this.fileservice.deletefile(id)
        return {
            message:"delted is done"
        }
    }

}


