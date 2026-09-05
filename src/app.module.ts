import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ApiConfigModule } from "src/config.module";
import { HelpersModule } from "src/helpers/helpers.module";
import { RoleModule } from "./modules/role/role.module";
import { CmsModule } from "./modules/cms/cms.module";
import { CmsRepositoryModule } from "./modules/cms/repositories/cms.repository.module";
import { UserModule } from "./modules/user/user.module";
import { UserRepositoryModule } from "./modules/user/repositories/user-repository.module";
import { SettingModule } from "./modules/setting/setting.module";
import { SettingRepositoryModule } from "./modules/setting/repositories/setting.repository.module";
import { RoleRepositoryModule } from "./modules/role/repositories/role.repository.module";

@Module({
  imports: [
    AuthModule,
    ApiConfigModule,
    HelpersModule,
    RoleModule,
    RoleRepositoryModule,
    UserModule,
    UserRepositoryModule,
    CmsModule,
    CmsRepositoryModule,
    SettingModule,
    SettingRepositoryModule,
  ],
  providers: [],
})
export class AppModule {}
