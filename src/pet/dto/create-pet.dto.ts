import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { PetType } from "../pet.enum";

export class CreatePetDto {

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(PetType)
    type: string;

    @IsNotEmpty()
    @IsString()
    breed: string;

    @IsDateString()
    @IsOptional()
    birhtday?: string;

    @IsNumber()
    @IsNotEmpty()
    price?: number;
}
