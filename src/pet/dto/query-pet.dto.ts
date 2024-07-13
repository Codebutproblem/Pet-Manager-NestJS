import { IsOptional } from "class-validator";

export class QueryPetDto {

    @IsOptional()
    type?: string;

    @IsOptional()
    breed?: string;

    @IsOptional()
    userId?: string;
}