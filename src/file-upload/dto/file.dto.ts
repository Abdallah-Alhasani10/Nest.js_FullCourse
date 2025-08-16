import { IsObject, IsOptional, IsString, MaxLength } from "class-validator";


export class FileDto{
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?:string;
}

