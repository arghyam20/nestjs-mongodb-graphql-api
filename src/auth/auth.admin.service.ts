import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UtilsHelper } from "src/helpers/utils.helper";
import { ApiResponse } from "src/common/types/api-response.type";
import mongoose from "mongoose";
import { MailerService } from "src/helpers/mailer.helper";
import { RoleRepository } from "src/modules/role/repositories/role.repository";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
} from "./dto/auth.dto";

@Injectable()
export class AuthAdminService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private utilsHelper: UtilsHelper,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async userLogin(body: SignInInput): Promise<ApiResponse> {
    const roleDetails = await this.roleRepository.getByField({
      role: "admin",
      isDeleted: false,
    });

    const checkIfExists = await this.userRepository.getByField({
      email: { $regex: "^" + body.email + "$", $options: "i" },
      isDeleted: false,
      role: roleDetails?._id,
    });
    if (!checkIfExists?._id) throw new BadRequestException("User not found!");

    if (
      !this.utilsHelper.validPassword(body.password, checkIfExists.password)
    ) {
      throw new BadRequestException("Authentication failed! invalid password");
    }

    const userDetails = await this.userRepository.getUserDetails({
      _id: checkIfExists._id,
    });
    if (!userDetails) throw new BadRequestException("User not found!");

    const payload = { id: checkIfExists._id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow("JWT_SECRET"),
      expiresIn: "7d",
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Signed in successfully",
      data: { user: userDetails, token: token },
    };
  }

  async forgotPassword(body: ForgotPasswordInput): Promise<ApiResponse> {
    const checkIfExists = await this.userRepository.getByField({
      email: { $regex: "^" + body.email + "$", $options: "i" },
      isDeleted: false,
    });

    if (!checkIfExists?._id) throw new BadRequestException("User not found!");

    const payload = { id: checkIfExists._id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow("JWT_SECRET"),
      expiresIn: "1d",
    });

    const projectName = process.env.PROJECT_NAME
      ? process.env.PROJECT_NAME
      : "Kohisi";

    const locals = {
      site_logo_url: `${process.env.BACKEND_URL}/images/logo.png`,
      name: "Admin",
      resetLink: `${body.baseUrl}/${token}`,
      project_name: projectName,
      current_year: new Date().getFullYear(),
    };

    await this.mailerService.sendMail(
      checkIfExists.email,
      "Password Reset Link",
      "forgot-password",
      locals
    );

    return {
      statusCode: HttpStatus.OK,
      message:
        "If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.",
    };
  }

  async resetPassword(body: ResetPasswordInput): Promise<ApiResponse> {
    let decoded = this.jwtService.verify(body.authToken, {
      secret: process.env.JWT_SECRET,
    });

    const roleDetails = await this.roleRepository.getByField({
      role: "admin",
      roleGroup: "backend",
      isDeleted: false,
    });

    const checkIfExists = await this.userRepository.getByField({
      _id: new mongoose.Types.ObjectId(decoded.id),
      isDeleted: false,
      role: roleDetails?._id,
    });

    if (!checkIfExists?._id) throw new BadRequestException("User not found!");

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(body.newPassword, salt);

    let updatePassword = await this.userRepository.updateById(
      {
        password: hash,
      },
      checkIfExists._id
    );

    if (updatePassword && updatePassword._id) {
      return {
        statusCode: HttpStatus.OK,
        message: "Password updated successfully.",
      };
    } else {
      throw new BadRequestException("Something went wrong!");
    }
  }
}
