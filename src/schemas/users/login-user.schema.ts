import "reflect-metadata";
import {
  IsEmail,
  IsString,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  NotContains,
  MinLength, IsNumber, IsEnum, IsOptional
} from "class-validator"
import { Type } from 'class-transformer';

export class LoginUserSchema {
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

