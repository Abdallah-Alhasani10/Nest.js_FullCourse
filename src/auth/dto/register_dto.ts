import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class RegisterDto{
    @IsNotEmpty({message:"Should not be Empty"})
    @IsEmail({},{message:"Write a correct email"})
    email:string;

    @IsNotEmpty({message:"Name should not be empty"})
    @IsString({message:"should be a string"})
    @MinLength(3,{message:"At leaset should be 3 char"})
    @MaxLength(50,{message:"At leaset should be 50 char"})
    name:string;

    @IsNotEmpty({message:"its requried"})
    @MinLength(6,{message:"should be greater than 6"})
    @IsString({message:"should be a string"})
    password:string;

}