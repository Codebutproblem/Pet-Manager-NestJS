import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DisplayUserDto } from './dto/display-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { ParseRolePipe } from './pipes/parserole.pipe';
import { ProfileUserDto } from './dto/profile-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() request: Request): Promise<ProfileUserDto> {
    return await this.userService.getProfile(request['user'].id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<DisplayUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<DisplayUserDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<{ message: string }> {
    await this.userService.update(id, updateUserDto)
    return {
      message: 'User updated successfully'
    };
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return {
      message: 'User deleted successfully'
    }
  }


  @Roles(Role.Admin)
  @Patch('/role/:id')
  async updateRole(@Param('id') id: string, @Body('role', ParseRolePipe) role: Role): Promise<{ message: string }> {
    await this.userService.updateRole(id, role);
    return {
      message: 'Role updated successfully'
    }
  }


}
