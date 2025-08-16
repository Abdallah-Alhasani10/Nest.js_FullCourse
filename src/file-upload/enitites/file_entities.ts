import { User } from "src/auth/entities/User_auth_dto";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    orginalFileName:string;

    @Column()
    mimeType:string;

    @Column()
    size:number;

    @Column()
    url:string;

    @Column()
    publicId:string;

    @Column({nullable:true})
    description:string;

    @ManyToOne(()=>User,{eager:true})
    uploader:User;
}