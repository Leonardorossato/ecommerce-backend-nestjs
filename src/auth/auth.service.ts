import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDTO } from './dto/login.auth.dto';
import { RegisterAuthDTO } from './dto/register.auth.dto';
import { CheckPassword } from './middleware/check.pass.mid';
import * as bcrypt from 'bcryptjs';
import { JwtInterface } from './interface/jwt.interface';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtSerivce: JwtService,
    private readonly checkPassword: CheckPassword,
  ) {}
  async login(dto: AuthLoginDTO) {
    try {
      const user = await this.usersService.findOneByEmail({
        email: dto.email,
        password: dto.password,
      });
      const token = await this.verifyToken(dto.email, dto.password, user.id);
      const wrongPassword = await this.checkPassword.hashPassword(
        dto.password,
        10,
      );
      if (!wrongPassword) {
        throw new NotFoundException('The password dosent match. Try again');
      }
      delete user.password;
      return { access_token: token };
    } catch (error) {
      throw new NotFoundException('email or password dosent match.');
    }
  }

  async register(dto: RegisterAuthDTO) {
    try {
      const hasPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.usersService.create({
        ...dto,
        password: hasPassword,
      });
      return user;
    } catch (error) {
      throw new HttpException(
        'Error creating a new user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayload(payload: JwtInterface): Promise<Users> {
    try {
      const user = await this.usersService.findOne({
        where: { email: payload.email },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.email}`,
      );
    }
  }

  async verifyToken(
    email: string,
    password: string,
    id: number,
  ): Promise<string> {
    const payload = {
      email,
      password,
      id,
    };

    if (!payload) {
      return null;
    }

    return this.jwtSerivce.sign(payload);
  }
}
