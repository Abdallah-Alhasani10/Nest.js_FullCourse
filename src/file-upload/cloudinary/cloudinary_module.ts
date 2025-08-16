import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./coluinary_provider";
import { CloudinaryService } from "./cloudinary_service";

@Module({
    providers:[CloudinaryProvider,CloudinaryService],
    exports:[CloudinaryService]
})
export class CloudinaryModule{}