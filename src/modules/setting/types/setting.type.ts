import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class SettingType {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  status: string;
}

@ObjectType()
export class SettingResponse {
  @Field(() => SettingType, { nullable: true })
  data?: SettingType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}
