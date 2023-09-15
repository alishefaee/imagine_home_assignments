import "reflect-metadata";
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  NotContains,
  MinLength
} from "class-validator"

export class CreateUserSchema {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @MinLength(7)
  @MaxLength(60)
  @IsNotEmpty()
  @NotContains(" ")
  password!: string
}

