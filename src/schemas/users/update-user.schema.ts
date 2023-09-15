import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, NotContains } from "class-validator";

export class UpdateUserSchema {
  @IsString()
  token!:string

  @IsString()
  @MinLength(7)
  @MaxLength(60)
  @IsNotEmpty()
  @NotContains(" ")
  @IsOptional()
  password?: string

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string
}