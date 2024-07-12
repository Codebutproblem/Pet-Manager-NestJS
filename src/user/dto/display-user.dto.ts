import { Expose, Transform } from "class-transformer";

export class DisplayUserDto {
    @Expose()
    id: string;

    @Expose()
    username: string;
    
    @Expose()
    email: string;

    firstName: string;

    lastName: string;

    @Transform(({obj}) => `${obj.firstName || ""} ${obj.lastName || ""}`)
    @Expose()
    fullName: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}