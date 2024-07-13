import { Base } from "src/common/entities/base.entity";
import { Pet } from "src/pet/entities/pet.entity";
import { Role } from "src/role/role.enum";
import { Column, Entity, OneToMany } from "typeorm";
@Entity()
export class User extends Base {

    @Column()
    username: string;


    @Column()
    hashedPassword: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    avatar: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ 
        default: Role.User,
        type: "enum",
        enum: Role
    })
    role: string;

    @Column({ default: 500 })
    budget: number;

    @Column({ default: null })
    refresh_token: string;

    @OneToMany((type) => Pet, pet => pet.user)
    pets: Pet[];
    
}
