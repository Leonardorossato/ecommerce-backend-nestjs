import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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

  async create(dto: CreateUserDTO) {
    try {
      const user = await this.usersRepository.save({
        ...dto,
      });
      return user;
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
