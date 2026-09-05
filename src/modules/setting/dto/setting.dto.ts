import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

@InputType()
export class UpdateSettingInput {
  @Field(() => String, { description: "Setting Id" })
  @IsString()
  @IsNotEmpty({ message: "Setting Id is required" })
  id: string;

  @Field(() => String, { description: "Email" })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Field(() => String, { description: "Phone" })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Phone is required" })
  phone: string;

  @Field(() => String, { description: "Address" })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Address is required" })
  address: string;
}
