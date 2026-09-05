import { Module } from "@nestjs/common";
import { UserAdminService } from "./user.admin.service";
import { UserAdminResolver } from "./user.admin.resolver";

@Module({
  imports: [],
  controllers: [],
  providers: [UserAdminService, UserAdminResolver],
})
export class UserModule {}
