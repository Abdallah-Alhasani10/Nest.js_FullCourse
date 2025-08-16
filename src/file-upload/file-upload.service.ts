import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './enitites/file_entities';
import { CloudinaryService } from './cloudinary/cloudinary_service';
import { User } from 'src/auth/entities/User_auth_dto';

@Injectable()
export class FileUploadService {


    constructor(@InjectRepository(File) private readonly fileRepostiory:Repository<File>,
                private readonly cloudinaryservice:CloudinaryService
                ){
    }

    async uploadfile(file:Express.Multer.File,description:string|undefined ,user:User):Promise<File>{
        const cloudinaryResponse=await this.cloudinaryservice.uploadFile(file)
        const filetodb=await this.fileRepostiory.create({
            orginalFileName:file.originalname,
            mimeType:file.mimetype,
            size:file.size,
            publicId:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
            description,
            uploader:user
        })
        return this.fileRepostiory.save(filetodb)
    }

    async deletefile(id:string):Promise<void>{
        const filetodelete=await this.fileRepostiory.findOne({where:{id}})
        if(!filetodelete){
            throw new NotFoundException(`file with ${id} not found to delete`)
        }
        await this.cloudinaryservice.deletefile(filetodelete.publicId)
        await this.fileRepostiory.remove(filetodelete);
    }
}
