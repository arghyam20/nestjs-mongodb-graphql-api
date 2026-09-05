import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { SettingResponse, SettingType } from "./types/setting.type";
import { GqlAuthGuard } from "src/common/guards/gql-auth.guard";
import { SettingAdminService } from "./setting.admin.service";
import { UpdateSettingInput } from "./dto/setting.dto";
import { Roles } from "src/common/decorator/role.decorator";
import { UserRole } from "src/common/enum/user-role.enum";
import { RBAcGuard } from "src/common/guards/rbac.guard";

@Resolver(() => SettingType)
export class SettingAdminResolver {
  constructor(private readonly settingService: SettingAdminService) {}

  @Query(() => SettingResponse)
  @Roles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, RBAcGuard)
  async getSettingByAdmin() {
    let result = await this.settingService.get();

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as SettingType,
    };
  }

  @Mutation(() => SettingResponse)
  @Roles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, RBAcGuard)
  async updateSettingByAdmin(@Args("input") input: UpdateSettingInput) {
    let result = await this.settingService.update(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as SettingType,
    };
  }
}
