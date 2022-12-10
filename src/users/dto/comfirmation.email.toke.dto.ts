import { IsNotEmpty } from 'class-validator';

export class EmailConfirmationTokenDTO {
  @IsNotEmpty({ message: 'O token é inválido' })
  token: string;
}
