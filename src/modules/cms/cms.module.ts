import { Module } from "@nestjs/common";
import { CmsAdminService } from "./cms.admin.service";
import { CmsAdminResolver } from "./cms.admin.resolver";

@Module({
  imports: [],
  controllers: [],
  providers: [CmsAdminService, CmsAdminResolver],
  exports: [CmsAdminService],
})
export class CmsModule {}
