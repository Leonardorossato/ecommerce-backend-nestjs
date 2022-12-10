import { Body, Controller, Delete, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async getAllUsers() {
    return await this.usersService.all();
  }

  @Delete('/delete/:id')
  async deletedUserById(@Body() id: number) {
    return await this.usersService.delete(id);
  }
}
