import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register_dto';
import { LoginDto } from './dto/login_dto';
import { JwtAuthGuard } from './Guards/auth_guard';
import { currentuser } from './Decorator/currentuser_decorators';
import { Roles } from './Decorator/role_decorator';
import { USERROLE, USERROLE as userrole } from './entities/User_auth_dto';
import { RolesGuard } from './Guards/RoleGuard';
import { LoginThrottlerGuard } from './Guards/login-throttler.gurad';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() registerdata:RegisterDto){
        return this.authService.register(registerdata)
    }



    @Roles(USERROLE.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register-admin')
    registerAdmin(@Body() registerdata: RegisterDto) {
    return this.authService.register(registerdata);
    }
    @UseGuards(LoginThrottlerGuard)
    @Post('login')
    login(@Body() logindata:LoginDto){
        return this.authService.login(logindata)
    }

    
    @Post('Refresh')
    refresh(@Body('Refreshtoken') Refreshtoken:string){
        return this.authService.regreshtoken(Refreshtoken)
    }
    

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getmyprfoile(@currentuser ()user:any){
        return user
    }
    

}
