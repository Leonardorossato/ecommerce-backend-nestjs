import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailConfirmationTokenDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'O token é inválido' })
  token: string;
}
