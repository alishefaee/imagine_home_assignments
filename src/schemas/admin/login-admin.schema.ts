import { IsEmail, IsString } from "class-validator"

export class LoginAdminSchema {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}