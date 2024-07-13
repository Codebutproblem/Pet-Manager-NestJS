import { Expose } from "class-transformer";
import { DisplayUserDto } from "./display-user.dto";

export class ProfileUserDto extends DisplayUserDto {
    @Expose()
    budget: number;
}