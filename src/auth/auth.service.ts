import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, USERROLE } from './entities/User_auth_dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register_dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login_dto';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>,
                private jwtservice:JwtService
    ){}

    async register(registerdata:RegisterDto){
        const olduser=await this.userRepository.findOne({
            where:{email:registerdata.email}
        })

        if(olduser){
            throw new ConflictException("email already exist")
        }
        const hashedpassword:string=await this.hashpassword(registerdata.password)
        const newUser=await this.userRepository.create({
            email: registerdata.email,
            name: registerdata.name,
            password: hashedpassword,
            role: USERROLE.USER,
            createdAt:new Date
        })


        const saved = await this.userRepository.save(newUser);
        const { password: _, ...userWithoutPassword } = saved;
        return userWithoutPassword;
    }



        async registerAdmin(registerdata:RegisterDto){
            const olduser=await this.userRepository.findOne({
                where:{email:registerdata.email}
            })

            if(olduser){
                throw new ConflictException("email already exist")
            }
            const hashedpassword:string=await this.hashpassword(registerdata.password)
            const newUser=await this.userRepository.create({
                email: registerdata.email,
                name: registerdata.name,
                password: hashedpassword,
                role: USERROLE.ADMIN,
                createdAt:new Date
            })


            const saved = await this.userRepository.save(newUser);
            const { password: _, ...userWithoutPassword } = saved;
            return userWithoutPassword;
    }

    async login(logindata:LoginDto){
        const olduser=await this.userRepository.findOne({
            where:{email:logindata.email}
        })

        if(!olduser || !(await this.comparepasswrod(logindata.password,olduser.password))){
            throw new UnauthorizedException("user are not found you have to register nigga or password is wrong")
        }


        const token=await this.generatejwt(olduser)
        console.log(token)
        const {password,...result}=olduser
        return {
            user:result,
            ...token,
            message:`welcome back ${olduser.name}`
        }
    }


    async regreshtoken(refreshtoken:string){
        try {
            const payload=this.jwtservice.verify(refreshtoken,{
                secret:"JWT-SECRET-Ref"
            })
            const user=await this.userRepository.findOneBy({id:payload.sub})
            if(!user){
                throw new UnauthorizedException("no user")
            }

            const token=await this.generatejwt(user)
            return token
        } catch (error) {
            throw new UnauthorizedException("no token")
        }
    }


    private async hashpassword(password:string):Promise<string>{
        return await bcrypt.hash(password,10);
    }

    private async comparepasswrod(palintext:string,userpassword:string):Promise<boolean>{
        return await bcrypt.compare(palintext,userpassword)
    }

    private async generatejwt(user:User){
        return {
            "AccessToken":await this.generateAccessToken(user),
            "RefreshToken":await this.generateRefreshToken(user)

        }
    }

    private async generateAccessToken(user:User):Promise<string>{
        const payload={email:user.email,sub:user.id,role:user.role}
        return this.jwtservice.sign(payload,{
            secret:"JWT-SECRET",
            expiresIn:'15m'
        })
    }

    private async generateRefreshToken(user:User):Promise<string>{
        const payload={sub:user.id}
        return this.jwtservice.sign(payload,{
            secret:"JWT-SECRET-Ref",
            expiresIn:'7d'
        })
    }

    async getuserbyid(userid:number){
        const user=await this.userRepository.findOne({
            where:{id:userid}
        })
        if(!user){
            throw new UnauthorizedException("the user are not found")
        }
        const {password,...result}=user;
        return result;
    }
}
