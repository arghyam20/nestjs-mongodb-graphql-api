import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CmsType {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  content: string;

  @Field()
  status: string;
}

@ObjectType()
export class CmsPaginationMeta {
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
export class CmsPaginateType {
  @Field(() => [CmsType])
  docs: CmsType[];

  @Field(() => CmsPaginationMeta)
  meta: CmsPaginationMeta;
}

@ObjectType()
export class CmsListingResponseType {
  @Field(() => CmsPaginateType, { nullable: true })
  data?: CmsPaginateType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}

@ObjectType()
export class CmsResponseType {
  @Field(() => CmsType, { nullable: true })
  data?: CmsType;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field()
  status: number;
}