// role_decorator.ts
import { SetMetadata } from '@nestjs/common';
import { USERROLE } from '../entities/User_auth_dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USERROLE[]) => SetMetadata(ROLES_KEY, roles);