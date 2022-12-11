import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  name: string;

  email: string;

  password: string;
}
