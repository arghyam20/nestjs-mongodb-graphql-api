import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthAdminService } from "./auth.admin.service";
import {
  AuthLoginResponseType,
  AuthResponseType,
  AuthType,
} from "./types/auth.type";
import {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
} from "./dto/auth.dto";

@Resolver(() => AuthType)
export class AuthAdminResolver {
  constructor(private authService: AuthAdminService) {}

  @Mutation(() => AuthLoginResponseType)
  async adminLogin(
    @Args("input") input: SignInInput
  ): Promise<AuthLoginResponseType> {
    const result = await this.authService.userLogin(input);

    if (result.statusCode === 200 && result.data) {
      const { user, token } = result.data as { user: AuthType; token: string };

      return {
        status: result.statusCode,
        data: {
          user: user as AuthType,
          token: token as string,
        },
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

  @Mutation(() => AuthResponseType)
  async adminForgotPassword(
    @Args("input") input: ForgotPasswordInput
  ): Promise<AuthResponseType> {
    const result = await this.authService.forgotPassword(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as AuthType,
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

  @Mutation(() => AuthResponseType)
  async adminResetPassword(
    @Args("input") input: ResetPasswordInput
  ): Promise<AuthResponseType> {
    const result = await this.authService.resetPassword(input);

    if (result.statusCode === 200 && result.data) {
      return {
        status: result.statusCode,
        data: result.data as AuthType,
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
