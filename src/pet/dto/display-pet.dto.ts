import { Expose } from "class-transformer";

export class DisplayPetDto {

    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    type: string;

    @Expose()
    breed: string;

    @Expose()
    birhtday?: Date;

    @Expose()
    health: number;

    @Expose()
    price: number;
}