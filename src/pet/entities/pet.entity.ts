import { Base } from "src/common/entities/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
@Entity()
export class Pet extends Base {

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    breed: string;

    @Column()
    color: string;

    @Column()
    birhtday: Date;

    @ManyToOne((type) => User, user => user.pets)
    user: User;
}
