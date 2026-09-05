import { HttpStatus, Injectable, BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";
import { ApiResponse } from "src/common/types/api-response.type";
import { SettingRepository } from "./repositories";
import { UpdateSettingInput } from "./dto/setting.dto";

@Injectable()
export class SettingAdminService {
  constructor(private settingRepository: SettingRepository) {}

  async get(): Promise<ApiResponse> {
    const cms = await this.settingRepository.findSettingCms();

    if (!cms) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Setting Data not found.",
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Setting retrieved successfully.",
      data: cms,
    };
  }

  async update(body: UpdateSettingInput): Promise<ApiResponse> {
    const settingDetails = await this.settingRepository.getByField({
      _id: new mongoose.Types.ObjectId(body.id),
      isDeleted: false,
    });
    if (!settingDetails?._id)
      throw new BadRequestException("Setting not found!");

    let updateSetting = await this.settingRepository.updateById(body, body.id);

    if (updateSetting && updateSetting._id) {
      return {
        statusCode: HttpStatus.OK,
        message: "Setting updated successfully.",
        data: updateSetting,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Something went wrong.",
      };
    }
  }
}
