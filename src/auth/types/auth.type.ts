import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class AuthRoleType {
  @Field(() => ID)
  _id: string;

  @Field()
  role: string;

  @Field()
  roleDisplayName: string;
}

@ObjectType()
export class AuthType {
  @Field(() => ID)
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  email: string;

  @Field()
  profileImage: string;

  @Field(() => AuthRoleType)
  role: AuthRoleType;

  @Field()
  status: string;

  @Field()
  deviceType: string;

  @Field()
  deviceToken: string;
}

@ObjectType()
export class AuthResponseType {
  @Field(() => AuthType, { nullable: true })
  data?: AuthType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}

@ObjectType()
export class LoginResponseData {
  @Field(() => AuthType)
  user: AuthType;

  @Field()
  token: string;
}

@ObjectType()
export class AuthLoginResponseType {
  @Field(() => LoginResponseData, { nullable: true })
  data?: LoginResponseData;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}
