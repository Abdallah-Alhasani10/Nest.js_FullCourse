import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class LoginDto{
    @IsNotEmpty({message:"Should not be Empty"})
    @IsEmail({},{message:"Write a correct email"})
    email:string;


    @IsNotEmpty({message:"its requried"})
    @MinLength(6,{message:"should be greater than 6"})
    @IsString({message:"should be a string"})
    password:string;

}