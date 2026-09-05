import { Module } from "@nestjs/common";
import { JwtStrategy } from "./strategy/auth.strategy";
import { JwtService } from "@nestjs/jwt";
import { AuthAdminResolver } from "./auth.admin.resolver";
import { AuthAdminService } from "./auth.admin.service";

@Module({
  imports: [],
  controllers: [],
  providers: [AuthAdminService, AuthAdminResolver, JwtStrategy, JwtService],
  exports: [JwtStrategy],
})
export class AuthModule {}
