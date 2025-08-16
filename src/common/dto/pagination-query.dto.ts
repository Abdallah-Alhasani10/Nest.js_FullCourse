import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationQueryDto{
    @IsOptional()
    @Type(()=>Number)
    @IsInt({message:"page must be Intger"})
    @Min(1,{message:"page must be at leats 1"})
    page?:number;

    @IsOptional()
    @Type(()=>Number)
    @IsInt({message:"limit must be Intger"})
    @Min(1,{message:"limit must be at leats 1"})
    @Max(100,{message:"limit must be at leats 1"})
    limit?:number=10;
}