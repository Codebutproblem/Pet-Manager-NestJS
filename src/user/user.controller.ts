import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DisplayUserDto } from './dto/display-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() request : Request){
    return this.userService.getProfile(request["user"]);
  }

  
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<{ message: string, user: DisplayUserDto }> {
    const displayUser = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: displayUser
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  

}
