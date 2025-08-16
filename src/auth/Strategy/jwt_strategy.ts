import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authservier :AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:"JWT-SECRET"
        })
    }
    async validate(payload:any) {
        try {
                const user=await this.authservier.getuserbyid(payload.sub)

                return {
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                }
        } catch (error) {
            throw new UnauthorizedException("invliad token")
        }

    }
}