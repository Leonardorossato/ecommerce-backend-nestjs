import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { AuthLoginDTO } from 'src/auth/dto/login.auth.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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
    const user = await this.usersRepository.findOneBy({ email: dto.email });
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_GATEWAY)
    }
    await this.usersRepository.save(user)
    return user;
   } catch (error) {
    throw new HttpException('Email not found', HttpStatus.BAD_REQUEST)
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
