import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Role } from "src/role/role.enum";

@Injectable()
export class ParseRolePipe implements PipeTransform<string, Role> {
  transform(value: string, metadata: ArgumentMetadata): Role {
    if (!Object.values(Role).includes(value as Role)) {
      throw new BadRequestException(`Invalid role value: ${value}`);
    }
    return value as Role;
  }
}