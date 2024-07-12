import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { DisplayUserDto } from './dto/display-user.dto';
import SystemConfig from 'src/config/sytem';
import ExceptionMessage from 'src/config/exception.message';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto): Promise<DisplayUserDto | undefined> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, SystemConfig.SALT_OR_ROUNDS);
      const savedUser = await this.userRepository.save({ ...createUserDto, hashedPassword });
      const diplayUser = plainToInstance(DisplayUserDto, savedUser, { excludeExtraneousValues: true });
      return diplayUser;
    } catch (error) {
      throw new HttpException(ExceptionMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<DisplayUserDto | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return plainToInstance(DisplayUserDto, user, { excludeExtraneousValues: true });
    } catch (error) {
      throw new HttpException(ExceptionMessage.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getProfile(user : any){
    return plainToInstance(DisplayUserDto, user, { excludeExtraneousValues: true});
  }
}
