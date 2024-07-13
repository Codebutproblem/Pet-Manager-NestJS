import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { DisplayPetDto } from './dto/display-pet.dto';
import { QueryPetDto } from './dto/query-pet.dto';

@UseGuards(AuthGuard)
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createPetDto: CreatePetDto) : Promise<DisplayPetDto> {
    return await this.petService.create(createPetDto);
  }

  @Get()
  async findAll(@Query() query: QueryPetDto) : Promise<DisplayPetDto[]> {
    return await this.petService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<DisplayPetDto> {
    return this.petService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) :Promise<{message:string}> {
    await this.petService.update(id, updatePetDto);
    return {
      message: 'Pet updated successfully'
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petService.remove(id);
  }

  @Get('buy/:id')
  async buy(@Param('id') id: string , @Request() request : Request) : Promise<{message:string, pet : DisplayPetDto}> {
    const pet =  await this.petService.buy(id, request['user']);
    return {
      message: 'Pet bought successfully',
      pet
    };
  }

  @Get('sell/:id')
  async sell(@Param('id') id: string , @Request() request : Request) : Promise<{message:string}> {
    await this.petService.sell(id, request['user'])
    return {
      message: 'Pet sold successfully',
    };
  }

  @Get('feed/:id')
  async feed(@Param('id') id: string , @Request() request : Request) : Promise<{message:string, pet: DisplayPetDto}> {
    const pet = await this.petService.feed(id, request['user'])
    return {
      message: 'Pet fed successfully',
      pet
    };
  }
}
