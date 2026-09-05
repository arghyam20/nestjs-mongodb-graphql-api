import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { ApiResponse } from "src/common/types/api-response.type";
import { UserRepository } from "./repositories/user.repository";
import {
  ChangePasswordUserInput,
  ListingFrontendUserInput,
  SaveFrontendUserInput,
  UpdateAdminInput,
  UpdateFrontendUserInput,
  UpdateUserStatusInput,
} from "./dto/user.dto";
import { UtilsHelper } from "src/helpers/utils.helper";
import { RoleRepository } from "../role/repositories/role.repository";
import { existsSync, unlinkSync } from "fs";

@Injectable()
export class UserAdminService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private utilsHelper: UtilsHelper
  ) {}

  async profileDetails(userId: string): Promise<ApiResponse> {
    const userDetails = await this.userRepository.getUserDetails({
      _id: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    });

    if (!userDetails) {
      return { statusCode: HttpStatus.NOT_FOUND, message: "User not found." };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "User retrieved successfully.",
      data: userDetails,
    };
  }

  async updateAdminProfile(body: UpdateAdminInput): Promise<ApiResponse> {
    const userDetails = await this.userRepository.getByField({
      _id: new mongoose.Types.ObjectId(body.id),
      isDeleted: false,
    });
    if (!userDetails?._id) throw new BadRequestException("User not found!");

    if (body.isImageDeleted === "true") {
      body.profileImage = "";

      if (userDetails.profileImage) {
        if (existsSync(`./public/uploads/users/${userDetails.profileImage}`)) {
          unlinkSync(`./public/uploads/users/${userDetails.profileImage}`);
        }
      }
    }

    if (body.profileImage && userDetails.profileImage) {
      if (existsSync(`./public/uploads/users/${userDetails.profileImage}`)) {
        unlinkSync(`./public/uploads/users/${userDetails.profileImage}`);
      }
    }

    body = this.utilsHelper.getNamesFromBody(body);

    let updateUser = await this.userRepository.updateById(body, body.id);
    if (updateUser && updateUser._id) {
      const userDetails = await this.userRepository.getUserDetails({
        _id: new mongoose.Types.ObjectId(updateUser._id),
        isDeleted: false,
      });

      return {
        statusCode: HttpStatus.OK,
        message: "User updated successfully.",
        data: userDetails || undefined,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async getAllFrontendUsers(
    body: ListingFrontendUserInput
  ): Promise<ApiResponse> {
    const userRole = await this.roleRepository.getByField({
      role: "user",
      isDeleted: false,
    });

    body["role"] = userRole?._id;

    let getAllUsers = await this.userRepository.getAllPaginateFrontend(body);

    if (getAllUsers) {
      return {
        statusCode: HttpStatus.OK,
        message: "User fetched successfully.",
        data: getAllUsers,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async saveFrontendUser(body: SaveFrontendUserInput): Promise<ApiResponse> {
    const userRole = await this.roleRepository.getByField({
      role: "user",
      isDeleted: false,
    });

    if (!userRole?._id) throw new BadRequestException("User role not found!");

    body.role = userRole._id;

    const isEmailExists = await this.userRepository.getByField({
      email: { $regex: "^" + body.email + "$", $options: "i" },
      isDeleted: false,
    });

    if (isEmailExists?._id)
      throw new BadRequestException("User with this email already exists!");

    body = this.utilsHelper.getNamesFromBody(body);

    let saveUser = await this.userRepository.save(body as any);
    if (saveUser && saveUser._id) {
      const userDetails = await this.userRepository.getUserDetails({
        _id: new mongoose.Types.ObjectId(saveUser._id),
        isDeleted: false,
      });

      return {
        statusCode: HttpStatus.OK,
        message: "User added successfully.",
        data: userDetails || undefined,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async getFrontendUser(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid ID format.",
      };
    }

    const userDetails = await this.userRepository.getUserDetails({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    });

    if (!userDetails) {
      return { statusCode: HttpStatus.NOT_FOUND, message: "User not found." };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "User retrieved successfully.",
      data: userDetails,
    };
  }

  async updateFrontendUser(
    body: UpdateFrontendUserInput
  ): Promise<ApiResponse> {
    const userDetails = await this.userRepository.getByField({
      _id: new mongoose.Types.ObjectId(body.id),
      isDeleted: false,
    });
    if (!userDetails?._id) throw new BadRequestException("User not found!");

    const isEmailExists = await this.userRepository.getByField({
      email: { $regex: "^" + body.email + "$", $options: "i" },
      isDeleted: false,
      _id: { $ne: body.id },
    });
    if (isEmailExists?._id)
      throw new BadRequestException("User with this email already exists!");

    if (body.isImageDeleted === "true") {
      body.profileImage = "";

      if (userDetails.profileImage) {
        if (existsSync(`./public/uploads/users/${userDetails.profileImage}`)) {
          unlinkSync(`./public/uploads/users/${userDetails.profileImage}`);
        }
      }
    }

    if (body.profileImage && userDetails.profileImage) {
      if (existsSync(`./public/uploads/users/${userDetails.profileImage}`)) {
        unlinkSync(`./public/uploads/users/${userDetails.profileImage}`);
      }
    }

    body = this.utilsHelper.getNamesFromBody(body);

    let updateUser = await this.userRepository.updateById(body, body.id);
    if (updateUser && updateUser._id) {
      const userDetails = await this.userRepository.getUserDetails({
        _id: new mongoose.Types.ObjectId(updateUser._id),
        isDeleted: false,
      });

      return {
        statusCode: HttpStatus.OK,
        message: "User updated successfully.",
        data: userDetails || undefined,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async deleteFrontendUser(id: string): Promise<ApiResponse> {
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid ID format.",
      };
    }

    const deleteData = await this.userRepository.updateById(
      { isDeleted: true },
      id
    );
    if (deleteData) {
      if (deleteData.profileImage) {
        if (existsSync(`./public/uploads/users/${deleteData.profileImage}`)) {
          unlinkSync(`./public/uploads/users/${deleteData.profileImage}`);
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: "User deleted successfully.",
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async statusUpdateFrontendUser(
    body: UpdateUserStatusInput
  ): Promise<ApiResponse> {
    const updatedValue = {
      status: body.status,
    };

    let updateStatus = await this.userRepository.updateById(
      updatedValue,
      body.id
    );
    if (updateStatus && updateStatus._id) {
      return {
        statusCode: HttpStatus.OK,
        message: "Status updated successfully.",
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }

  async changePassword(body: ChangePasswordUserInput): Promise<ApiResponse> {
    if (
      !body.id ||
      typeof body.id !== "string" ||
      !mongoose.Types.ObjectId.isValid(body.id)
    ) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid ID format.",
      };
    }

    const user = await this.userRepository.getAllByFieldWithProjection(
      { _id: body.id, isDeleted: false },
      {
        password: 1,
      }
    );

    if (!user) {
      throw new BadRequestException("User is not found!");
    }

    const oldPasswordMatch = this.utilsHelper.validPassword(
      body.currentPassword,
      user[0].password
    );
    if (!oldPasswordMatch) {
      throw new BadRequestException("Current password is not match");
    }

    const newPassVsOldPass = this.utilsHelper.validPassword(
      body.password,
      user[0].password
    );
    if (newPassVsOldPass) {
      throw new BadRequestException(
        "New password cannot be same as your old password!"
      );
    }

    const pwd = body.password;
    body.password = this.utilsHelper.generateHash(pwd);

    const userUpdate = await this.userRepository.updateById(body, body.id);

    if (userUpdate && userUpdate._id) {
      return {
        statusCode: HttpStatus.OK,
        message: "User password updated successfully.",
        data: userUpdate,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Password not updated.",
      };
    }
  }

  async dashboardPageStats(): Promise<any> {
    const userRole = await this.roleRepository.getByField({
      role: "user",
      isDeleted: false,
    });
    const totalUserCount = await this.userRepository.getCountByParam({
      role: userRole?._id,
      isDeleted: false,
    });
    const activeUserCount = await this.userRepository.getCountByParam({
      role: userRole?._id,
      status: "Active",
      isDeleted: false,
    });
    const inactiveUserCount = await this.userRepository.getCountByParam({
      role: userRole?._id,
      status: "Inactive",
      isDeleted: false,
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Dashboard statistics fetch successfully.",
      data: {
        totalUserCount,
        activeUserCount,
        inactiveUserCount,
      },
    };
  }
}
