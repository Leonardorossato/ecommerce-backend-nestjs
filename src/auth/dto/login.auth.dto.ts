import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AuthLoginDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    password: string;
}