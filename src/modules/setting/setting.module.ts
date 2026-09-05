import { Module } from "@nestjs/common";
import { SettingAdminResolver } from "./setting.admin.resolver";
import { SettingAdminService } from "./setting.admin.service";

@Module({
  imports: [],
  controllers: [],
  providers: [SettingAdminResolver, SettingAdminService],
})
export class SettingModule {}
