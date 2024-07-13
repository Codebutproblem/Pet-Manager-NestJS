import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { DisplayPetDto } from './dto/display-pet.dto';
import { QueryPetDto } from './dto/query-pet.dto';
import { User } from 'src/user/entities/user.entity';
import { PetType } from './pet.enum';
import SystemConfig from 'src/config/sytem';

@Injectable()
export class PetService {

    constructor(
        @InjectRepository(Pet) private readonly petRepository: Repository<Pet>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async create(createPetDto: CreatePetDto): Promise<DisplayPetDto> {
        const { birhtday, ...savedData } = createPetDto;
        if (birhtday) {
            savedData['birhtday'] = new Date(birhtday);
        }
        const savedPet = await this.petRepository.save(savedData);
        return plainToInstance(DisplayPetDto, savedPet);
    }

    async findAll(query: QueryPetDto): Promise<DisplayPetDto[]> {
        const pets = await this.petRepository.find({ where: query });
        return pets.map(pet => plainToInstance(DisplayPetDto, pet));
    }

    async findOne(id: string): Promise<DisplayPetDto> {
        const pet = await this.petRepository.findOne({ where: { id } });
        return plainToInstance(DisplayPetDto, pet);
    }

    async update(id: string, updatePetDto: UpdatePetDto): Promise<void> {
        await this.petRepository.update(id, updatePetDto);
    }

    async remove(id: string): Promise<void> {
        await this.petRepository.softDelete(id);
    }

    async buy(id: string, user: any): Promise<DisplayPetDto> {
        const pet = await this.petRepository.findOne({ where: { id }, relations: ['user'] });
        if (pet.user) {
            throw new BadRequestException('Pet already sold');
        }
        if (user.pubget < pet.price) {
            throw new BadRequestException('Insufficient budget');
        }

        user.budget -= pet.price;
        pet.user = user;
        await this.userRepository.save(user);

        const updatePet = await this.petRepository.save(pet);
        return plainToInstance(DisplayPetDto, updatePet, { excludeExtraneousValues: true });
    }

    async sell(id: string, user: any): Promise<void> {
        const pet = await this.petRepository.findOne({ where: { id }, relations: ['user'] });

        if (!pet.user || pet.user.id !== user.id) {
            throw new BadRequestException('Not your pet');
        }

        user.budget += pet.price;
        pet.user = null;
        await this.userRepository.save(user);

        await this.petRepository.save(pet);
    }

    async feed(id: string, user: any): Promise<DisplayPetDto> {
        const pet = await this.petRepository.findOne({ where: { id }, relations: ['user'] });
        switch (pet.type) {
            case PetType.DOG:
                user.budget -= 20;
                pet.health += 15;
                pet.price += 25;
                break;
            case PetType.CAT:
                user.budget -= 15;
                pet.health += 15;
                pet.price += 20;
                break;
            case PetType.FISH:
                user.budget -= 5;
                pet.health += 10;
                pet.price += 10;
                break;
            case PetType.BIRD:
                user.budget -= 10;
                pet.health += 10;
                pet.price += 15;
                break;
            default:
                throw new InternalServerErrorException('Unknown pet type');
        }

        user.budget = Math.max(0, user.budget);
        pet.health = Math.min(SystemConfig.MAX_PET_HEALTH, pet.health);

        await this.userRepository.save(user);
        
        const updatedPet = await this.petRepository.save(pet);

        return plainToInstance(DisplayPetDto, updatedPet, { excludeExtraneousValues: true });
    }
}
