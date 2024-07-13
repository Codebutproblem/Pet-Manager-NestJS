import { Expose, Transform } from "class-transformer";
import { DisplayBaseDto } from "src/common/dtos/display_base.dto";

export class DisplayUserDto extends DisplayBaseDto {

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
    role: string
}