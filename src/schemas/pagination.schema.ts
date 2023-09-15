import { IsJSON, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from "class-validator"

export class PaginationSchema {
  @IsNumberString()
  @IsOptional()
  offset?:number

  @IsNumberString()
  @IsOptional()
  limit?:number

  @IsJSON()
  @IsOptional()
  order?: object

  @IsNumberString()
  @IsOptional()
  sort?:string
}