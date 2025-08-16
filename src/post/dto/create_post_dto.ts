import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class createPostdto{
    @IsNotEmpty({message:'shold not be empty'})
    @IsString({message:'should be string'})
    @MinLength(3,{message:'greater than 3'})
    @MaxLength(50,{message:"should be less than 50"})
    title:string
    // @IsNotEmpty({message:'shold not be empty'})
    // @IsString({message:'should be string'})
    // @MinLength(3,{message:'greater than 3'})
    // @MaxLength(50,{message:"should be less than 50"})
    // authorname:string
    @IsNotEmpty({message:'shold not be empty'})
    @IsString({message:'should be string'})
    @MinLength(3,{message:'greater than 3'})
    @MaxLength(50,{message:"should be less than 50"})
    content:string
}