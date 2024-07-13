import { Expose } from "class-transformer";

export class DisplayBaseDto {

    @Expose()
    id: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}