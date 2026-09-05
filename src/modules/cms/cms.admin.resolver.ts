import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
// import { UseGuards } from '@nestjs/common';
import { CmsAdminService } from "./cms.admin.service";
import {
  CmsListingResponseType,
  CmsPaginateType,
  CmsResponseType,
  CmsType,
} from "./types/cms.type";
import {
  CmsListingInput,
  UpdateCmsInput,
  UpdateCmsStatusInput,
} from "./dto/cms.dto";
import { GqlAuthGuard } from "src/common/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => CmsType)
export class CmsAdminResolver {
  constructor(private readonly cmsService: CmsAdminService) {}

  @Query(() => CmsListingResponseType)
  @UseGuards(GqlAuthGuard)
  async getAllCmsByAdmin(
    @Args("input") input: CmsListingInput
  ): Promise<CmsListingResponseType> {
    const result = await this.cmsService.getAll(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as CmsPaginateType,
        message: result.message,
        success: true,
      };
    }

    return {
      status: result.statusCode,
      data: undefined,
      message: result.message || "Failed to fetch CMS entries",
      success: false,
    };
  }

  @Query(() => CmsResponseType)
  @UseGuards(GqlAuthGuard)
  async getCmsByAdmin(
    @Args("id", { type: () => ID }) id: string
  ): Promise<CmsResponseType> {
    const result = await this.cmsService.get(id);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as CmsType,
        message: result.message,
        success: true,
      };
    }

    return {
      data: undefined,
      status: result.statusCode,
      message: result.message || "CMS not found",
      success: false,
    };
  }

  @Mutation(() => CmsResponseType)
  @UseGuards(GqlAuthGuard)
  async updateCmsByAdmin(
    @Args("input") input: UpdateCmsInput
  ): Promise<CmsResponseType> {
    const result = await this.cmsService.update(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as CmsType,
        message: result.message,
        success: true,
      };
    }

    return {
      data: undefined,
      status: result.statusCode,
      message: result.message || "Something went wrong",
      success: false,
    };
  }

  @Mutation(() => CmsResponseType)
  @UseGuards(GqlAuthGuard)
  async changeCmsStatusByAdmin(
    @Args("input") input: UpdateCmsStatusInput
  ): Promise<CmsResponseType> {
    const result = await this.cmsService.statusUpdate(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as CmsType,
        message: result.message,
        success: true,
      };
    }

    return {
      data: undefined,
      status: result.statusCode,
      message: result.message || "Something went wrong",
      success: false,
    };
  }
}
