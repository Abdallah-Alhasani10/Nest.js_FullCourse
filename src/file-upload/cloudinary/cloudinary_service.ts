import { Inject, Injectable } from "@nestjs/common";
import { UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";
@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private readonly cloudinary: any) {}

    uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
            {
            folder: "nestjs_course", // اسم المجلد في Cloudinary
            resource_type: 'auto',   // لاحظ التصحيح: resource_type وليس resourse_Type
            },
            (error: any, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result);
            },
        );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);  // إرسال بيانات الملف إلى stream
        });
    }
    async deletefile(publicId:string):Promise<any>{
        return this.cloudinary.uploader.destroy(publicId)
    }
}
