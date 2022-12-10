import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { FindOneOptions, Repository } from 'typeorm';
import * as cacheManager from 'cache-manager';
import { CreateUserDTO } from './dto/create.user.dto';
import { Users } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailConfirmationTokenDTO } from './dto/comfirmation.email.toke.dto';
import { AuthLoginDTO } from 'src/auth/dto/login.auth.dto';

@Injectable()
export class UsersService {
  public memoryCache;

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly mailService: MailerService,
  ) {
    this.memoryCache = cacheManager.caching('memory');
  }

  async all(): Promise<Users[]> {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (error) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(where: FindOneOptions<Users>): Promise<Users> {
    const user = this.usersRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `There isn't any user with identifier: ${where}`,
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email: email });
      if (user) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Erro to fin a userEmail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByEmail(dto: AuthLoginDTO) {
    try {
      const user = await this.usersRepository.findOneBy({ email: dto.email });
      return user;
    } catch (error) {
      throw new NotFoundException('Email não encontrado');
    }
  }

  async create(dto: CreateUserDTO) {
    try {
      const email = dto.email;
      const recoverToken = randomBytes(3).toString('hex');
      await this.memoryCache.set(recoverToken, { ...dto });
      const userEmail = await this.usersRepository.findOneBy({
        email: dto.email,
      });
      if (userEmail) {
        throw new HttpException('Email already exitis', HttpStatus.BAD_REQUEST);
      }
      if (!userEmail) {
        const mail = {
          to: email,
          from: 'noreply@application.com',
          subject: 'Confirmação do email',
          template: 'confirmation',
          context: {
            token: recoverToken,
          },
        };
        await this.mailService.sendMail(mail);
      }
      return await this.usersRepository.save(userEmail);
    } catch (error) {
      throw new NotFoundException('Erro to create a new User');
    }
  }

  async delete(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      if (user) {
        throw new HttpException(
          `User with this ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersRepository.delete(user);
      return user;
    } catch (error) {
      throw new HttpException(
        'Erro to delete this user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
