import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailSchema {
  @IsEmail()
  @IsNotEmpty()
  email!: string
}