import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class RoleType {
  @Field(() => ID)
  _id: string;

  @Field()
  role: string;

  @Field()
  roleDisplayName: string;
}

@ObjectType()
export class UserType {
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

  @Field(() => RoleType)
  role: RoleType;

  @Field()
  status: string;

  @Field()
  deviceType: string;

  @Field()
  deviceToken: string;
}

@ObjectType()
export class UserPaginationMeta {
  @Field(() => Int)
  totalDocs: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Boolean)
  hasPrevPage: boolean;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Int, { nullable: true })
  prevPage?: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;
}

@ObjectType()
export class UserPaginateType {
  @Field(() => [UserType])
  docs: UserType[];

  @Field(() => UserPaginationMeta)
  meta: UserPaginationMeta;
}

@ObjectType()
export class UserListingResponseType {
  @Field(() => UserPaginateType, { nullable: true })
  data?: UserPaginateType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}

@ObjectType()
export class UserResponseType {
  @Field(() => UserType, { nullable: true })
  data?: UserType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}
