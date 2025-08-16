import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User_auth_dto';
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt'
import { RolesGuard } from './Guards/RoleGuard';
import { JwtStrategy } from './Strategy/jwt_strategy';


@Module({
  imports:[TypeOrmModule.forFeature([User]),
          PassportModule,
          JwtModule.register({})
          ],
  controllers: [AuthController],
  providers: [AuthService,RolesGuard,JwtStrategy],
  exports:[AuthService,RolesGuard]
})
export class AuthModule {}
