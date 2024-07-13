import { Base } from "src/common/entities/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PetType } from "../pet.enum";
import SystemConfig from 'src/config/sytem';

@Entity()
export class Pet extends Base {

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: PetType
    })
    type: string;

    @Column()
    breed: string;

    @Column()
    birhtday: Date;

    @Column({
        default: SystemConfig.MAX_PET_HEALTH
    })
    health: number;

    @Column()
    price: number;

    @ManyToOne((type) => User, user => user.pets)
    user: User;
}
