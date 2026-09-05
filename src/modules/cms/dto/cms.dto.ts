import { InputType, Field, ID, Int } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

@InputType()
export class UpdateCmsInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty({ message: "Content is required" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsNotEmpty({ message: "CMS ID is required" })
  id: string;
}

@InputType()
export class CmsListingInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  page?: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsNumber()
  limit?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
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
}

@InputType()
export class UpdateCmsStatusInput {
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
  @IsNotEmpty({ message: "CMS ID is required" })
  id: string;
}
