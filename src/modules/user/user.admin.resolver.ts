import { Resolver, Query, Args, ID, Mutation } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UserAdminService } from "./user.admin.service";
import {
  UserListingResponseType,
  UserPaginateType,
  UserResponseType,
  UserType,
} from "./types/user.type";
import { GqlAuthGuard } from "src/common/guards/gql-auth.guard";
import {
  ChangePasswordUserInput,
  ListingFrontendUserInput,
  SaveFrontendUserInput,
  UpdateAdminInput,
  UpdateFrontendUserInput,
  UpdateUserStatusInput,
} from "./dto/user.dto";
// @ts-ignore
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { handleGraphQLFileUpload } from "src/common/interceptors/files.interceptor";
import { LoginUser } from "src/common/decorator/login-user.decorator";

@Resolver(() => UserType)
export class UserAdminResolver {
  constructor(private userService: UserAdminService) {}

  @Query(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async adminProfileDetails(@LoginUser() user: any): Promise<UserResponseType> {
    const result = await this.userService.profileDetails(user._id);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Mutation(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async adminProileUpdate(
    @Args("input") input: UpdateAdminInput,
    @Args({ name: "profileImage", type: () => GraphQLUpload, nullable: true })
    profileImage?: FileUpload
  ): Promise<UserResponseType> {
    if (profileImage) {
      const { filename } = await handleGraphQLFileUpload(profileImage, "users");
      input.profileImage = filename;
    }

    const result = await this.userService.updateAdminProfile(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Mutation(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async adminChangePassword(
    @Args("input") input: ChangePasswordUserInput
  ): Promise<UserResponseType> {
    const result = await this.userService.changePassword(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Query(() => UserListingResponseType)
  @UseGuards(GqlAuthGuard)
  async getAllByAdmin(
    @Args("input") input: ListingFrontendUserInput
  ): Promise<UserListingResponseType> {
    const result = await this.userService.getAllFrontendUsers(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as UserPaginateType,
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

  @Query(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async getUserByAdmin(
    @Args("id", { type: () => ID }) id: string
  ): Promise<UserResponseType> {
    const result = await this.userService.getFrontendUser(id);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as UserType,
        message: result.message,
        success: true,
      };
    }

    return {
      data: undefined,
      status: result.statusCode,
      message: result.message || "User not found",
      success: false,
    };
  }

  @Mutation(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async saveUserByAdmin(
    @Args("input") input: SaveFrontendUserInput,
    @Args({ name: "profileImage", type: () => GraphQLUpload, nullable: true })
    profileImage?: FileUpload
  ): Promise<UserResponseType> {
    if (profileImage) {
      const { filename } = await handleGraphQLFileUpload(profileImage, "users");
      input.profileImage = filename;
    }

    const result = await this.userService.saveFrontendUser(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Mutation(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async updateUserByAdmin(
    @Args("input") input: UpdateFrontendUserInput,
    @Args({ name: "profileImage", type: () => GraphQLUpload, nullable: true })
    profileImage?: FileUpload
  ): Promise<UserResponseType> {
    if (profileImage) {
      const { filename } = await handleGraphQLFileUpload(profileImage, "users");
      input.profileImage = filename;
    }

    const result = await this.userService.updateFrontendUser(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Mutation(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async changeUserStatusByAdmin(
    @Args("input") input: UpdateUserStatusInput
  ): Promise<UserResponseType> {
    const result = await this.userService.statusUpdateFrontendUser(input);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  @Query(() => UserResponseType)
  @UseGuards(GqlAuthGuard)
  async deleteUserByAdmin(
    @Args("id", { type: () => ID }) id: string
  ): Promise<UserResponseType> {
    const result = await this.userService.deleteFrontendUser(id);

    return {
      status: result.statusCode,
      message: result.message,
      success: result.statusCode === 200,
      data: result.data as UserType,
    };
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => UserResponseType)
  // async saveUser(
  //   @Args("input") input: SaveFrontendUserInput,
  //   @Args({ name: "profileImage", type: () => GraphQLUpload, nullable: true })
  //   profileImage?: FileUpload,
  //   @Args({
  //     name: "galleryImages",
  //     type: () => [GraphQLUpload],
  //     nullable: true,
  //   })
  //   galleryImages?: Promise<FileUpload>[]
  // ): Promise<UserResponseType> {
  //   console.log(input, galleryImages, "@TEST");

  //   console.log(galleryImages);

  //   let galleryFilePaths: string[] = [];
  //   if (galleryImages && galleryImages.length) {
  //     for (const imagePromise of galleryImages) {
  //       const resolved = await imagePromise;
  //       const { filename } = await handleGraphQLFileUpload(resolved, "gallery");
  //       galleryFilePaths.push(filename);
  //     }
  //   }

  //   console.log(galleryFilePaths);

  //   if (profileImage) {
  //     const { filename } = await handleGraphQLFileUpload(profileImage, "users");
  //     input.profileImage = filename;
  //   }

  //   // You can now pass input to your service
  //   return {
  //     status: 200,
  //     message: "User created",
  //     success: true,
  //     data: undefined, // replace with actual user
  //   };
  // }
}
