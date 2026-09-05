import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

export class RoleListingDto {
  @ApiProperty({ description: "Role Group", enum: ["admin", "frontend"] })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  roleGroup: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  page?: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  limit?: number;

  @ApiProperty({ description: "Search...", required: false })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ description: "Status Filter", required: false })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ description: "Sort Field", required: false })
  @IsString()
  @IsOptional()
  sortField: string;

  @ApiProperty({
    description: "Sort Order",
    required: false,
    enum: ["asc", "desc"],
  })
  @IsString()
  @IsOptional()
  sortOrder: string;
}
