import { Base } from "src/common/entities/base.entity";
import { Pet } from "src/pet/entities/pet.entity";
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
        default: "USER",
        type: "enum",
        enum: ["USER", "ADMIN"]
    })
    role: string;

    @OneToMany((type) => Pet, pet => pet.user)
    pets: Pet[];
    
}
