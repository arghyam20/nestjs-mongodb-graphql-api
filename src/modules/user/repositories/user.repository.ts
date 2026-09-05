import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Model, PipelineStage, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import _ from "lodash";
import { BaseRepository } from "src/common/bases/base.repository";
import { User, UserDocument } from "../schemas/user.schema";
import { ListingFrontendUserInput } from "../dto/user.dto";
import { PaginationResponse } from "src/common/types/api-response.type";

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super(UserModel);
  }

  async getUserDetailsJwtAuth(
    id: Types.ObjectId | string
  ): Promise<UserDocument | null> {
    let user = await this.UserModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          isDeleted: false,
          status: "Active",
        },
      },
      {
        $lookup: {
          from: "roles",
          let: { role: "$role" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$role"] }],
                },
              },
            },
            {
              $project: {
                _id: "$_id",
                role: "$role",
                roleDisplayName: "$roleDisplayName",
              },
            },
          ],
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $lookup: {
          from: "user_devices",
          localField: "_id",
          foreignField: "user_id",
          as: "user_devices",
        },
      },
      {
        $project: {
          uid: "$uid",
          firstName: "$firstName",
          lastName: "$lastName",
          activityName: "$activityName",
          phoneNumber: "$phoneNumber",
          profilePicture: "$profilePicture",
          country: "$country",
          languages: "$languages",
          lastDelivery: "$lastDelivery",
          lastOnline: "$lastOnline",
          isOnline: "$isOnline",
          description: "$description",
          twoFactorEnabled: "$twoFactorEnabled",
          role: "$role",
          email: "$email",
          emailOtp: "$emailOtp",
          emailOtpExpire: "$emailOtpExpire",
          password: "$password",
          isEmailVerified: "$isEmailVerified",
          isAccountVerified: "$isAccountVerified",
          userVerificationFiles: "$userVerificationFiles",
          signupVerifyToken: "$signupVerifyToken",
          signupVerifyTokenExpiry: "$signupVerifyTokenExpiry",
          resetPasswordToken: "$resetPasswordToken",
          resetPasswordTokenExpiry: "$resetPasswordTokenExpiry",
          parent_id: "$parent_id",
          googleToken: "$googleToken",
          facebookToken: "$facebookToken",
          twitterToken: "$twitterToken",
          status: "$status",
          isDeleted: "$isDeleted",
          stripe_customer_id: "$stripe_customer_id",
          stripe_connect_id: "$stripe_connect_id",
          is_stripe_setup_completed: "$is_stripe_setup_completed",
          stripe_connect_settings: "$stripe_connect_settings",
          user_devices: "$user_devices",
        },
      },
    ]);

    if (!user?.length) return null;
    return user[0];
  }

  async fineOneWithRole(
    params: any
  ): Promise<UserDocument | null> {
    return await this.UserModel.findOne(params).populate("role").exec();
  }

  async getUserDetails(
    params: any
  ): Promise<UserDocument | null> {
    let aggregate = await this.UserModel.aggregate([
      { $match: params },
      {
        $lookup: {
          from: "roles",
          let: { role: "$role" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$role"] }],
                },
              },
            },
            {
              $project: {
                _id: "$_id",
                role: "$role",
                roleDisplayName: "$roleDisplayName",
              },
            },
          ],
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $project: {
          password: 0,
          isDeleted: 0,
          updatedAt: 0,
          countryCode: 0,
          emailOtp: 0,
          otpExpireTime: 0,
        },
      },
    ]);
    if (!aggregate?.length) return null;
    return aggregate[0];
  }

  async getAllPaginateFrontend(
    paginatedDto: ListingFrontendUserInput
  ): Promise<PaginationResponse<UserDocument>> {
    let conditions = {};
    let and_clauses: any[] = [];
    const page = paginatedDto.page || 1;
    const limit = paginatedDto.limit || 10;
    const skip = (page - 1) * limit;
    and_clauses.push({ isDeleted: false, role: { $eq: paginatedDto.role } });
    // Optional search condition
    if (paginatedDto.search) {
      const searchRegex = new RegExp(paginatedDto.search, "i"); // Case-insensitive search
      and_clauses.push({
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { userName: searchRegex },
        ],
      });
    }

    // Optional status filter
    if (paginatedDto.status) {
      and_clauses.push({ status: paginatedDto.status });
    }

    const sortField = paginatedDto.sortField || "createdAt"; // Default to sorting by _id if no field is provided
    const sortOrder = paginatedDto.sortOrder === "asc" ? 1 : -1; // Default to descending order if not provided

    conditions["$and"] = and_clauses;

    const filterPipeline: PipelineStage[] = [
      { $match: conditions },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: +limit },
      {
        $project: {
          fullName: 1,
          email: 1,
          profileImage: 1,
          createdAt: 1,
          status: 1,
        },
      },
    ];

    const countPipeline: PipelineStage[] = [
      { $match: conditions },
      { $count: "total" },
    ];

    // Perform the aggregation
    const [countResult, aggregate] = await Promise.all([
      this.UserModel.aggregate(countPipeline, { allowDiskUse: true })
        .exec()
        .catch((error) => {
          throw new InternalServerErrorException(
            `Error during count aggregation: ${error.message}`
          );
        }),
      this.UserModel.aggregate(filterPipeline, { allowDiskUse: true })
        .exec()
        .catch((error) => {
          throw new InternalServerErrorException(
            `Error during data aggregation: ${error.message}`
          );
        }),
    ]);

    const hasNextPage =
      (countResult.length ? countResult[0].total : 0) > 0 &&
      countResult[0].total - (skip + aggregate.length) > 0
        ? true
        : false;
    const hasPrevPage = page != 1;

    return {
      meta: {
        totalDocs: countResult.length ? countResult[0].total : 0,
        skip: skip,
        page: page,
        limit: limit,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
      },
      docs: aggregate,
    };
  }

  async getUserDetailsPermissions(
    id: Types.ObjectId | string
  ): Promise<any> {
    let user = await this.UserModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "roles",
          let: { role: "$role" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$role"] }],
                },
              },
            },
            {
              $project: {
                _id: "$_id",
                role: "$role",
                roleDisplayName: "$roleDisplayName",
              },
            },
          ],
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $lookup: {
          from: "permissions",
          let: { role: "$role._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$role", "$$role"] }],
                },
              },
            },
            {
              $project: {
                accessIds: "$accessIds",
              },
            },
          ],
          as: "providedAccess",
        },
      },
      {
        $unwind: {
          path: "$providedAccess",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "accesses",
          let: { accessIds: "$providedAccess.accessIds" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$accessIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1, // Replace with actual access fields
                slug: 1, // Replace with actual access fields
              },
            },
          ],
          as: "providedAccess.accessDetails",
        },
      },
      {
        $project: {
          password: 0,
          isDeleted: 0,
          updatedAt: 0,
          countryCode: 0,
          phone: 0,
          emailOtp: 0,
          otpExpireTime: 0,
        },
      },
    ]);

    if (!user?.length) return null;

    return user[0].providedAccess.accessDetails;
  }
}
