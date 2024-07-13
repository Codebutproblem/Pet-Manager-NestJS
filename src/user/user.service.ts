import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import SystemConfig from 'src/config/sytem';
import { Role } from 'src/role/role.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DisplayUserDto } from './dto/display-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto): Promise<DisplayUserDto | undefined> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, SystemConfig.SALT_OR_ROUNDS);
    const savedUser = await this.userRepository.save({ ...createUserDto, hashedPassword });
    const diplayUser = plainToInstance(DisplayUserDto, savedUser, { excludeExtraneousValues: true });
    return diplayUser;
  }

  async findAll(): Promise<DisplayUserDto[] | undefined[]> {
    const users = await this.userRepository.find();
    return users.map(user => plainToInstance(DisplayUserDto, user, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<DisplayUserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(DisplayUserDto, user, { excludeExtraneousValues: true });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async updateRole(id: string, role: Role): Promise<void> {
    await this.userRepository.update(id, { role });
  }

  async getProfile(id: string): Promise<ProfileUserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(ProfileUserDto, user, { excludeExtraneousValues: true });
  }
}
