import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class RegisterAuthDTO {
    @IsNotEmpty()
    @ApiProperty({ nullable: false, type: String })
    name: string;

    @IsEmail({}, { message: 'The email must be valid' })
    @IsString()
    @ApiProperty({ nullable: false, type: String })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ nullable: false, type: String })
    password: string;

    @IsNotEmpty()
    @ApiProperty({ nullable: false, type: String })
    @Matches(/^\+[0-11]{3}\.?[0-11]{3}\.?[0-11]{3}\-?[0-11]{2}$/)
    cpf: string;   
}