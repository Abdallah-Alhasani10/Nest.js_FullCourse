import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { USERROLE } from "../entities/User_auth_dto";
import { ROLES_KEY } from "../Decorator/role_decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<USERROLE[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        );
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException("user is not authenticated");
        }
        const hasRoles = requiredRoles.some(role => user.role === role);
        if (!hasRoles) {
            throw new ForbiddenException("you dont have the permsssioon");
        }
        return true;
    }
}
