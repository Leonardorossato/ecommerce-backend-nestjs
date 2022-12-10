import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/login.auth.dto';
import { RegisterAuthDTO } from './dto/register.auth.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUserCredentials(@Body() dto: AuthLoginDTO) {
    return await this.authService.login(dto);
  }

  @Post('/register')
  async registerUser(@Body() dto: RegisterAuthDTO) {
    return await this.authService.register(dto);
  }
}
