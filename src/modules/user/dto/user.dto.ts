import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { Types } from "mongoose";

@InputType()
export class ListingFrontendUserInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @Field({ nullable: true, description: "Search..." })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true, description: "Status Filter" })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortField?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortOrder?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: Types.ObjectId;
}

@InputType()
export class SaveFrontendUserInput {
  @Field({ nullable: true })
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  email: string;

  @Field({ nullable: true })
  @IsNotEmpty({ message: "Password is required!" })
  password: string;

  @Field({ nullable: true })
  @IsNotEmpty({ message: "Full Name is required!" })
  fullName: string;

  @IsOptional()
  profileImage?: string;

  @IsOptional()
  role?: string | Types.ObjectId;
}

@InputType()
export class UpdateUserStatusInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: "Status is required" })
  @Matches(/^(Active|Inactive)$/, {
    message: 'Status must be either "Active" or "Inactive"',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  status: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty({ message: "User ID is required" })
  id: string;
}

@InputType()
export class UpdateFrontendUserInput {
  @Field({ nullable: true })
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  email: string;

  @Field({ nullable: true })
  @IsNotEmpty({ message: "Full Name is required!" })
  fullName: string;

  @Field(() => Boolean, {
    nullable: true,
    description: "Flag to indicate if profile image should be deleted",
    defaultValue: false,
  })
  @IsOptional()
  isImageDeleted?: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty({ message: "User ID is required" })
  id: string;

  @IsOptional()
  profileImage?: string;
}

@InputType()
export class ChangePasswordUserInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: "Current Password is required!" })
  currentPassword: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: "New Password is required!" })
  password: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty({ message: "User ID is required" })
  id: string;
}

@InputType()
export class UpdateAdminInput {
  @Field({ nullable: true })
  @IsNotEmpty({ message: "Full Name is required!" })
  fullName: string;

  @Field(() => Boolean, {
    nullable: true,
    description: "Flag to indicate if profile image should be deleted",
    defaultValue: false,
  })
  @IsOptional()
  isImageDeleted?: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty({ message: "User ID is required" })
  id: string;

  @IsOptional()
  profileImage?: string;
}
