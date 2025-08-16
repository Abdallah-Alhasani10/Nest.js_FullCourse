import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "src/common/dto/pagination-query.dto";

export class FindPostQueryDTO extends PaginationQueryDto{
    @IsOptional()
    @IsString({message:"Title must be string"})
    @MaxLength(100,{message:"title service can't exceed 100 characters "})
    title?:string;
}