import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsString({ message: "Value must be a string" })
  @IsNotEmpty({ message: "Email is required!" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  email: string;

  @Field(() => String)
  @IsString({ message: "Value must be a string" })
  @IsNotEmpty({ message: "Password is required!" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field(() => String)
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Base URL is required!" })
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  baseUrl: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsNotEmpty({ message: "New password is required!" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newPassword: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Authorization token is required!" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  authToken: string;
}
