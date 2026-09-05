// src/common/guards/rbac.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserRole } from "../enum/user-role.enum";

@Injectable()
export class RBAcGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const gqlCtx = GqlExecutionContext.create(context);
    const user = gqlCtx.getContext().req.user;

    if (!user) throw new ForbiddenException("User not authenticated");
    if (!roles.includes(user.role.role)) {
      throw new ForbiddenException("Forbidden resource");
    }

    return true;
  }
}
